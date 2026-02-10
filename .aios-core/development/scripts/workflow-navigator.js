/**
 * Workflow Navigator - Next-Step Suggestions for Workflow State
 *
 * Provides intelligent next-step command suggestions based on:
 * - Current workflow state (detected from command history)
 * - Workflow transitions (defined in workflow-patterns.yaml)
 * - Context data (story path, branch, epic)
 *
 * Features:
 * - State detection from successful command completion
 * - Pre-populated command templates
 * - Numbered list formatting for user selection
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const WORKFLOW_PATTERNS_PATH = path.join(process.cwd(), '.aios-core', 'data', 'workflow-patterns.yaml');

class WorkflowNavigator {
  constructor() {
    this.patterns = this._loadPatterns();
  }

  /**
   * Detect current workflow state from command history
   * @param {Array<string>} commandHistory - Recent commands executed
   * @param {Object} context - Session context (story_path, branch, etc.)
   * @returns {Object|null} { workflow, state, context } or null if no state detected
   */
  detectWorkflowState(commandHistory, context = {}) {
    if (!commandHistory || commandHistory.length === 0) {
      return null;
    }

    const lastCommand = commandHistory[commandHistory.length - 1];

    // Check each workflow's transitions
    for (const [workflowName, workflowDef] of Object.entries(this.patterns.workflows || {})) {
      if (!workflowDef.transitions) {
        continue;
      }

      for (const [stateName, transition] of Object.entries(workflowDef.transitions)) {
        if (this._matchesTrigger(lastCommand, transition.trigger)) {
          return {
            workflow: workflowName,
            state: stateName,
            context: this.extractContext(context),
          };
        }
      }
    }

    return null;
  }

  /**
   * Suggest next commands for current workflow state
   * @param {Object} workflowState - { workflow, state, context }
   * @returns {Array} Array of suggestions with pre-populated commands
   */
  suggestNextCommands(workflowState) {
    if (!workflowState || !workflowState.workflow || !workflowState.state) {
      return [];
    }

    const workflow = this.patterns.workflows[workflowState.workflow];
    if (!workflow || !workflow.transitions) {
      return [];
    }

    const transition = workflow.transitions[workflowState.state];
    if (!transition || !transition.next_steps) {
      return [];
    }

    // Generate suggestions with pre-populated templates
    const suggestions = transition.next_steps.map(step => {
      const command = this.populateTemplate(step.args_template, workflowState.context);
      return {
        command: `*${step.command}${command ? ' ' + command : ''}`,
        description: step.description || '',
        raw_command: step.command,
        args: command,
      };
    });

    return suggestions;
  }

  /**
   * Populate command template with context variables
   * @param {string} template - Template string (e.g., "${story_path}")
   * @param {Object} context - Context variables
   * @returns {string} Populated template
   */
  populateTemplate(template, context) {
    if (!template) {
      return '';
    }

    let result = template;

    // Replace ${variable} with context values
    const variables = template.match(/\$\{([^}]+)\}/g);
    if (variables) {
      variables.forEach(variable => {
        const key = variable.slice(2, -1); // Remove ${ and }
        const value = context[key] || '';
        result = result.replace(variable, value);
      });
    }

    return result.trim();
  }

  /**
   * Format suggestions as numbered list
   * @param {Array} suggestions - Suggestion objects
   * @param {string} header - Optional header text
   * @returns {string} Formatted suggestions
   */
  formatSuggestions(suggestions, header = 'Next steps:') {
    if (!suggestions || suggestions.length === 0) {
      return '';
    }

    const lines = [header, ''];

    suggestions.forEach((suggestion, index) => {
      const number = index + 1;
      const desc = suggestion.description ? ` - ${suggestion.description}` : '';
      lines.push(`${number}. \`${suggestion.command}\`${desc}`);
    });

    return lines.join('\n');
  }

  /**
   * Extract context from session/environment
   * @param {Object} rawContext - Raw context data
   * @returns {Object} Normalized context
   */
  extractContext(rawContext = {}) {
    return {
      story_path: rawContext.story_path || rawContext.currentStory || '',
      branch: rawContext.branch || rawContext.gitBranch || '',
      epic: rawContext.epic || rawContext.currentEpic || '',
    };
  }

  /**
   * Check if command matches trigger pattern
   * @private
   * @param {string} command - Command to check
   * @param {string} trigger - Trigger pattern
   * @returns {boolean} True if matches
   */
  _matchesTrigger(command, trigger) {
    if (!command || !trigger) {
      return false;
    }

    // Simple substring matching for now
    // Examples:
    // - "validate-story-draft completed successfully"
    // - "develop completed"
    const triggerCommand = trigger.split(' ')[0]; // Get command name
    return command.includes(triggerCommand);
  }

  /**
   * Load workflow patterns from YAML
   * @private
   * @returns {Object} Workflow patterns
   */
  _loadPatterns() {
    try {
      if (!fs.existsSync(WORKFLOW_PATTERNS_PATH)) {
        console.warn('[WorkflowNavigator] Patterns file not found');
        return { workflows: {} };
      }

      const content = fs.readFileSync(WORKFLOW_PATTERNS_PATH, 'utf8');
      return yaml.load(content) || { workflows: {} };
    } catch (error) {
      console.warn('[WorkflowNavigator] Failed to load patterns:', error.message);
      return { workflows: {} };
    }
  }

  /**
   * Get greeting message for workflow state
   * @param {Object} workflowState - Workflow state
   * @returns {string} Greeting message
   */
  getGreetingMessage(workflowState) {
    if (!workflowState || !workflowState.workflow || !workflowState.state) {
      return '';
    }

    const workflow = this.patterns.workflows[workflowState.workflow];
    if (!workflow || !workflow.transitions) {
      return '';
    }

    const transition = workflow.transitions[workflowState.state];
    return transition?.greeting_message || '';
  }

  /**
   * Load development activation context if available
   * Used after Phase 11 (Development Activation) completes
   * @returns {Object|null} Development context or null
   */
  loadDevelopmentContext() {
    try {
      const activationPath = path.join(
        process.cwd(),
        '.aios',
        'workflow-state',
        'development-activation.json'
      );

      if (!fs.existsSync(activationPath)) {
        return null;
      }

      const content = fs.readFileSync(activationPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.warn('[WorkflowNavigator] Failed to load development context:', error.message);
      return null;
    }
  }

  /**
   * Get next story suggestion based on priority
   * Finds first uncompleted CRITICAL story, then HIGH, then MEDIUM
   * @param {Object} developmentContext - Context from development activation
   * @returns {Object|null} Suggested story or null
   */
  getNextStorySuggestion(developmentContext) {
    if (!developmentContext?.stories?.length) {
      return null;
    }

    // Find first uncompleted CRITICAL story
    const critical = developmentContext.stories.find(s =>
      s.priority && s.priority.includes('CRITICAL') && s.status !== 'Completed'
    );

    if (critical) {
      return {
        storyId: critical.id,
        title: critical.title,
        command: critical.activationCommand,
        reason: 'Next CRITICAL priority story',
      };
    }

    // Fallback to first uncompleted HIGH story
    const high = developmentContext.stories.find(s =>
      s.priority && s.priority.includes('HIGH') && s.status !== 'Completed'
    );

    if (high) {
      return {
        storyId: high.id,
        title: high.title,
        command: high.activationCommand,
        reason: 'Next HIGH priority story',
      };
    }

    // Fallback to any uncompleted story
    const next = developmentContext.stories.find(s => s.status !== 'Completed');
    return next ? {
      storyId: next.id,
      title: next.title,
      command: next.activationCommand,
      reason: 'Next uncompleted story',
    } : null;
  }
}

module.exports = WorkflowNavigator;
