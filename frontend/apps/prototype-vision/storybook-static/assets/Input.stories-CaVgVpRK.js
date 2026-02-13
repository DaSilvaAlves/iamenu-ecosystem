import{j as e}from"./jsx-runtime-B4hUth8J.js";import{R as ga,r as i}from"./iframe-BIROZn-X.js";import{S as ya,X as wa}from"./x-CmKUqFDC.js";import{c as pa}from"./createLucideIcon-D_yLTFe7.js";import{M as va,L as fa}from"./mail-BFbG0dB6.js";import"./preload-helper-C1FmrZbK.js";/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ea=pa("EyeOff",[["path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24",key:"1jxqfv"}],["path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",key:"9wicm4"}],["path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",key:"1jreej"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ta=pa("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]),l=ga.forwardRef(({type:s="text",label:r,error:a,hint:t,icon:n,clearable:d=!1,onClear:o,className:p="",inputClassName:L="",disabled:F=!1,required:R=!1,value:c,onChange:u,...U},_)=>{const[$,ua]=i.useState(!1),ma=s==="textarea",m=s==="password",O=s==="search",z=c&&typeof c=="string"&&c.length>0,ha=m?$?"text":"password":s,X=`
    w-full bg-surface-card border rounded-lg px-4 py-2.5
    text-white placeholder-text-muted
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
    ${n||O?"pl-10":""}
    ${m||d&&z?"pr-10":""}
    ${a?"border-red-500 focus:ring-red-500/50 focus:border-red-500":"border-border"}
  `,ba=ma?"textarea":"input",xa=()=>{o==null||o(),u&&u({target:{value:""}})};return e.jsxs("div",{className:`space-y-1.5 ${p}`,children:[r&&e.jsxs("label",{className:"block text-sm font-medium text-white",children:[r,R&&e.jsx("span",{className:"text-red-500 ml-1",children:"*"})]}),e.jsxs("div",{className:"relative",children:[(n||O)&&e.jsx("div",{className:"absolute left-3 top-1/2 -translate-y-1/2 text-text-muted",children:n?e.jsx(n,{className:"w-4 h-4"}):e.jsx(ya,{className:"w-4 h-4"})}),ba==="input"?e.jsx("input",{ref:_,type:ha,disabled:F,required:R,className:`${X} ${L}`,value:c,onChange:u,...U}):e.jsx("textarea",{ref:_,disabled:F,required:R,className:`${X} ${L}`,value:c,onChange:u,...U}),e.jsxs("div",{className:"absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2",children:[d&&z&&!m&&e.jsx("button",{type:"button",onClick:xa,className:"text-text-muted hover:text-white transition-colors",children:e.jsx(wa,{className:"w-4 h-4"})}),m&&e.jsx("button",{type:"button",onClick:()=>ua(!$),className:"text-text-muted hover:text-white transition-colors",children:$?e.jsx(Ea,{className:"w-4 h-4"}):e.jsx(Ta,{className:"w-4 h-4"})})]})]}),a&&e.jsx("p",{className:"text-sm text-red-500",children:a}),t&&!a&&e.jsx("p",{className:"text-sm text-text-muted",children:t})]})});l.displayName="Input";l.__docgenInfo={description:"",methods:[],displayName:"Input",props:{type:{required:!1,tsType:{name:"union",raw:"'text' | 'email' | 'password' | 'number' | 'search' | 'textarea'",elements:[{name:"literal",value:"'text'"},{name:"literal",value:"'email'"},{name:"literal",value:"'password'"},{name:"literal",value:"'number'"},{name:"literal",value:"'search'"},{name:"literal",value:"'textarea'"}]},description:"Input type (text, email, password, number, search, textarea)",defaultValue:{value:"'text'",computed:!1}},label:{required:!1,tsType:{name:"string"},description:"Label text displayed above input"},error:{required:!1,tsType:{name:"string"},description:"Error message displayed below input"},hint:{required:!1,tsType:{name:"string"},description:"Helper text displayed below input (when no error)"},icon:{required:!1,tsType:{name:"ReactFC",raw:"React.FC<{ className?: string }>",elements:[{name:"signature",type:"object",raw:"{ className?: string }",signature:{properties:[{key:"className",value:{name:"string",required:!1}}]}}]},description:"Icon component to display on the left"},clearable:{required:!1,tsType:{name:"boolean"},description:"Show clear button when input has value",defaultValue:{value:"false",computed:!1}},onClear:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when clear button is clicked"},inputClassName:{required:!1,tsType:{name:"string"},description:"Additional classes for input element",defaultValue:{value:"''",computed:!1}},value:{required:!1,tsType:{name:"string"},description:"Current input value"},className:{defaultValue:{value:"''",computed:!1},required:!1},disabled:{defaultValue:{value:"false",computed:!1},required:!1},required:{defaultValue:{value:"false",computed:!1},required:!1}}};const ka={component:l,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{type:{control:{type:"select"},options:["text","email","password","number","search","textarea"],description:"Input type"},disabled:{control:{type:"boolean"},description:"Disable the input"},required:{control:{type:"boolean"},description:"Mark as required"},clearable:{control:{type:"boolean"},description:"Show clear button when has value"},error:{control:{type:"text"},description:"Error message"},hint:{control:{type:"text"},description:"Helper text"},label:{control:{type:"text"},description:"Label text"}}},h={args:{type:"text",placeholder:"Enter text...",label:"Text Input"}},b={args:{type:"text",placeholder:"Search...",label:"Text with Icon",icon:Search}},x={args:{type:"text",placeholder:"Type something to clear...",label:"Clearable Text",clearable:!0,value:"Sample text"}},g={args:{type:"text",placeholder:"Enter username",label:"Username",hint:"Use letters, numbers, and underscore only"}},y={args:{type:"text",placeholder:"Disabled input",label:"Disabled Input",disabled:!0,value:"Cannot edit"}},w={args:{type:"text",placeholder:"This field is required",label:"Required Field",required:!0}},v={args:{type:"text",placeholder:"Invalid input",label:"With Error",error:"This field is required",value:""}},f={args:{type:"email",placeholder:"example@email.com",label:"Email Address",icon:va}},E={args:{type:"email",placeholder:"example@email.com",label:"Email Address",value:"invalid-email",error:"Please enter a valid email address"}},T={args:{type:"email",placeholder:"example@email.com",label:"Email Address",disabled:!0,value:"user@example.com"}},S={args:{type:"password",placeholder:"Enter password",label:"Password",icon:fa}},I={args:{type:"password",placeholder:"Enter password",label:"Password",hint:"At least 8 characters with uppercase, lowercase, and numbers"}},C={args:{type:"password",placeholder:"Enter password",label:"Password",value:"weak",error:"Password must be at least 8 characters"}},j={args:{type:"number",placeholder:"Enter a number",label:"Age",min:0,max:120}},N={args:{type:"number",placeholder:"Enter amount",label:"Amount (€)",hint:"Enter amount in euros"}},q={args:{type:"search",placeholder:"Search products...",label:"Search",clearable:!0}},P={args:{type:"search",placeholder:"Search...",label:"Search",disabled:!0}},k={args:{type:"textarea",placeholder:"Enter your message...",label:"Message"}},V={args:{type:"textarea",placeholder:"Enter your message...",label:"Message",error:"Message must be at least 10 characters",value:"Too short"}},W={args:{type:"textarea",placeholder:"Enter your feedback...",label:"Feedback",hint:"Please be as detailed as possible"}},M={args:{type:"textarea",placeholder:"Cannot edit",label:"Disabled Textarea",disabled:!0,value:"This textarea is disabled and cannot be edited."}},A={render:function(){const[r,a]=i.useState("");return e.jsx(l,{type:"text",placeholder:"Type something...",label:"Interactive Input",clearable:!0,value:r,onChange:t=>a(t.target.value),onClear:()=>a("")})}},D={render:function(){const[r,a]=i.useState("");return e.jsx(l,{type:"password",placeholder:"Enter password",label:"Interactive Password",value:r,onChange:t=>a(t.target.value)})}},H={render:function(){const[r,a]=i.useState(""),[t,n]=i.useState(""),d=o=>{const p=o.target.value;a(p),n(p.length<10?"Minimum 10 characters":"")};return e.jsx(l,{type:"textarea",placeholder:"Enter at least 10 characters...",label:"Interactive Textarea",value:r,onChange:d,error:t,hint:`${r.length}/10 characters`})}};var Z,B,G;h.parameters={...h.parameters,docs:{...(Z=h.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    label: 'Text Input'
  }
}`,...(G=(B=h.parameters)==null?void 0:B.docs)==null?void 0:G.source}}};var J,K,Q;b.parameters={...b.parameters,docs:{...(J=b.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    type: 'text',
    placeholder: 'Search...',
    label: 'Text with Icon',
    icon: Search
  }
}`,...(Q=(K=b.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var Y,ee,ae;x.parameters={...x.parameters,docs:{...(Y=x.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    type: 'text',
    placeholder: 'Type something to clear...',
    label: 'Clearable Text',
    clearable: true,
    value: 'Sample text'
  }
}`,...(ae=(ee=x.parameters)==null?void 0:ee.docs)==null?void 0:ae.source}}};var re,te,se;g.parameters={...g.parameters,docs:{...(re=g.parameters)==null?void 0:re.docs,source:{originalSource:`{
  args: {
    type: 'text',
    placeholder: 'Enter username',
    label: 'Username',
    hint: 'Use letters, numbers, and underscore only'
  }
}`,...(se=(te=g.parameters)==null?void 0:te.docs)==null?void 0:se.source}}};var ne,le,oe;y.parameters={...y.parameters,docs:{...(ne=y.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    type: 'text',
    placeholder: 'Disabled input',
    label: 'Disabled Input',
    disabled: true,
    value: 'Cannot edit'
  }
}`,...(oe=(le=y.parameters)==null?void 0:le.docs)==null?void 0:oe.source}}};var ce,ie,de;w.parameters={...w.parameters,docs:{...(ce=w.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    type: 'text',
    placeholder: 'This field is required',
    label: 'Required Field',
    required: true
  }
}`,...(de=(ie=w.parameters)==null?void 0:ie.docs)==null?void 0:de.source}}};var pe,ue,me;v.parameters={...v.parameters,docs:{...(pe=v.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    type: 'text',
    placeholder: 'Invalid input',
    label: 'With Error',
    error: 'This field is required',
    value: ''
  }
}`,...(me=(ue=v.parameters)==null?void 0:ue.docs)==null?void 0:me.source}}};var he,be,xe;f.parameters={...f.parameters,docs:{...(he=f.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {
    type: 'email',
    placeholder: 'example@email.com',
    label: 'Email Address',
    icon: Mail
  }
}`,...(xe=(be=f.parameters)==null?void 0:be.docs)==null?void 0:xe.source}}};var ge,ye,we;E.parameters={...E.parameters,docs:{...(ge=E.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  args: {
    type: 'email',
    placeholder: 'example@email.com',
    label: 'Email Address',
    value: 'invalid-email',
    error: 'Please enter a valid email address'
  }
}`,...(we=(ye=E.parameters)==null?void 0:ye.docs)==null?void 0:we.source}}};var ve,fe,Ee;T.parameters={...T.parameters,docs:{...(ve=T.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  args: {
    type: 'email',
    placeholder: 'example@email.com',
    label: 'Email Address',
    disabled: true,
    value: 'user@example.com'
  }
}`,...(Ee=(fe=T.parameters)==null?void 0:fe.docs)==null?void 0:Ee.source}}};var Te,Se,Ie;S.parameters={...S.parameters,docs:{...(Te=S.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  args: {
    type: 'password',
    placeholder: 'Enter password',
    label: 'Password',
    icon: Lock
  }
}`,...(Ie=(Se=S.parameters)==null?void 0:Se.docs)==null?void 0:Ie.source}}};var Ce,je,Ne;I.parameters={...I.parameters,docs:{...(Ce=I.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
  args: {
    type: 'password',
    placeholder: 'Enter password',
    label: 'Password',
    hint: 'At least 8 characters with uppercase, lowercase, and numbers'
  }
}`,...(Ne=(je=I.parameters)==null?void 0:je.docs)==null?void 0:Ne.source}}};var qe,Pe,ke;C.parameters={...C.parameters,docs:{...(qe=C.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  args: {
    type: 'password',
    placeholder: 'Enter password',
    label: 'Password',
    value: 'weak',
    error: 'Password must be at least 8 characters'
  }
}`,...(ke=(Pe=C.parameters)==null?void 0:Pe.docs)==null?void 0:ke.source}}};var Ve,We,Me;j.parameters={...j.parameters,docs:{...(Ve=j.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  args: {
    type: 'number',
    placeholder: 'Enter a number',
    label: 'Age',
    min: 0,
    max: 120
  }
}`,...(Me=(We=j.parameters)==null?void 0:We.docs)==null?void 0:Me.source}}};var Ae,De,He;N.parameters={...N.parameters,docs:{...(Ae=N.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
  args: {
    type: 'number',
    placeholder: 'Enter amount',
    label: 'Amount (€)',
    hint: 'Enter amount in euros'
  }
}`,...(He=(De=N.parameters)==null?void 0:De.docs)==null?void 0:He.source}}};var Re,$e,Le;q.parameters={...q.parameters,docs:{...(Re=q.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  args: {
    type: 'search',
    placeholder: 'Search products...',
    label: 'Search',
    clearable: true
  }
}`,...(Le=($e=q.parameters)==null?void 0:$e.docs)==null?void 0:Le.source}}};var Fe,Ue,_e;P.parameters={...P.parameters,docs:{...(Fe=P.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  args: {
    type: 'search',
    placeholder: 'Search...',
    label: 'Search',
    disabled: true
  }
}`,...(_e=(Ue=P.parameters)==null?void 0:Ue.docs)==null?void 0:_e.source}}};var Oe,ze,Xe;k.parameters={...k.parameters,docs:{...(Oe=k.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  args: {
    type: 'textarea',
    placeholder: 'Enter your message...',
    label: 'Message'
  }
}`,...(Xe=(ze=k.parameters)==null?void 0:ze.docs)==null?void 0:Xe.source}}};var Ze,Be,Ge;V.parameters={...V.parameters,docs:{...(Ze=V.parameters)==null?void 0:Ze.docs,source:{originalSource:`{
  args: {
    type: 'textarea',
    placeholder: 'Enter your message...',
    label: 'Message',
    error: 'Message must be at least 10 characters',
    value: 'Too short'
  }
}`,...(Ge=(Be=V.parameters)==null?void 0:Be.docs)==null?void 0:Ge.source}}};var Je,Ke,Qe;W.parameters={...W.parameters,docs:{...(Je=W.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  args: {
    type: 'textarea',
    placeholder: 'Enter your feedback...',
    label: 'Feedback',
    hint: 'Please be as detailed as possible'
  }
}`,...(Qe=(Ke=W.parameters)==null?void 0:Ke.docs)==null?void 0:Qe.source}}};var Ye,ea,aa;M.parameters={...M.parameters,docs:{...(Ye=M.parameters)==null?void 0:Ye.docs,source:{originalSource:`{
  args: {
    type: 'textarea',
    placeholder: 'Cannot edit',
    label: 'Disabled Textarea',
    disabled: true,
    value: 'This textarea is disabled and cannot be edited.'
  }
}`,...(aa=(ea=M.parameters)==null?void 0:ea.docs)==null?void 0:aa.source}}};var ra,ta,sa;A.parameters={...A.parameters,docs:{...(ra=A.parameters)==null?void 0:ra.docs,source:{originalSource:`{
  render: function Component() {
    const [value, setValue] = useState('');
    return <Input type="text" placeholder="Type something..." label="Interactive Input" clearable value={value} onChange={e => setValue(e.target.value)} onClear={() => setValue('')} />;
  }
}`,...(sa=(ta=A.parameters)==null?void 0:ta.docs)==null?void 0:sa.source}}};var na,la,oa;D.parameters={...D.parameters,docs:{...(na=D.parameters)==null?void 0:na.docs,source:{originalSource:`{
  render: function Component() {
    const [value, setValue] = useState('');
    return <Input type="password" placeholder="Enter password" label="Interactive Password" value={value} onChange={e => setValue(e.target.value)} />;
  }
}`,...(oa=(la=D.parameters)==null?void 0:la.docs)==null?void 0:oa.source}}};var ca,ia,da;H.parameters={...H.parameters,docs:{...(ca=H.parameters)==null?void 0:ca.docs,source:{originalSource:`{
  render: function Component() {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      setError(newValue.length < 10 ? 'Minimum 10 characters' : '');
    };
    return <Input type="textarea" placeholder="Enter at least 10 characters..." label="Interactive Textarea" value={value} onChange={handleChange} error={error} hint={\`\${value.length}/10 characters\`} />;
  }
}`,...(da=(ia=H.parameters)==null?void 0:ia.docs)==null?void 0:da.source}}};const Va=["Text","TextWithIcon","TextClearable","TextWithHint","TextDisabled","TextRequired","TextWithError","Email","EmailWithError","EmailDisabled","Password","PasswordWithHint","PasswordWithError","Number","NumberWithHint","SearchInput","SearchInputDisabled","Textarea","TextareaWithError","TextareaWithHint","TextareaDisabled","InteractiveText","InteractivePassword","InteractiveTextarea"];export{f as Email,T as EmailDisabled,E as EmailWithError,D as InteractivePassword,A as InteractiveText,H as InteractiveTextarea,j as Number,N as NumberWithHint,S as Password,C as PasswordWithError,I as PasswordWithHint,q as SearchInput,P as SearchInputDisabled,h as Text,x as TextClearable,y as TextDisabled,w as TextRequired,v as TextWithError,g as TextWithHint,b as TextWithIcon,k as Textarea,M as TextareaDisabled,V as TextareaWithError,W as TextareaWithHint,Va as __namedExportsOrder,ka as default};
