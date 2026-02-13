import{j as e}from"./jsx-runtime-B4hUth8J.js";import{R as He}from"./iframe-BIROZn-X.js";import{m as Se,B as s}from"./Button-Dlju2FsN.js";import"./preload-helper-C1FmrZbK.js";const S={default:"bg-surface border border-border",elevated:"bg-surface-card shadow-lg",outlined:"bg-transparent border border-border",interactive:"bg-surface border border-border hover:border-primary/50 cursor-pointer"},t=He.forwardRef(({children:r,variant:a="default",padding:we="md",className:N="",onClick:b,animate:j=!1,...y},w)=>{const Te=S[a]||S.default,T={none:"",sm:"p-3",md:"p-5",lg:"p-6"},H=`rounded-xl transition-all duration-200 ${Te} ${T[we]||T.md}`;return j||a==="interactive"?e.jsx(Se.div,{ref:w,className:`${H} ${N}`,onClick:b,whileHover:a==="interactive"?{y:-4,boxShadow:"0 12px 24px rgba(0,0,0,0.3)"}:{},whileTap:a==="interactive"?{scale:.98}:{},initial:j?{opacity:0,y:20}:!1,animate:j?{opacity:1,y:0}:!1,...y,children:r}):e.jsx("div",{ref:w,className:`${H} ${N}`,onClick:b,...y,children:r})});t.displayName="Card";const fe=({children:r,className:a=""})=>e.jsx("div",{className:`mb-4 ${a}`,children:r});fe.displayName="Card.Header";const je=({children:r,className:a=""})=>e.jsx("h3",{className:`text-lg font-bold text-white ${a}`,children:r});je.displayName="Card.Title";const Ne=({children:r,className:a=""})=>e.jsx("p",{className:`text-sm text-text-muted mt-1 ${a}`,children:r});Ne.displayName="Card.Description";const be=({children:r,className:a=""})=>e.jsx("div",{className:a,children:r});be.displayName="Card.Content";const ye=({children:r,className:a=""})=>e.jsx("div",{className:`mt-4 pt-4 border-t border-border ${a}`,children:r});ye.displayName="Card.Footer";Object.assign(t,{Header:fe,Title:je,Description:Ne,Content:be,Footer:ye});t.__docgenInfo={description:"",methods:[],displayName:"Card",props:{variant:{required:!1,tsType:{name:"union",raw:"'default' | 'elevated' | 'outlined' | 'interactive'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'elevated'"},{name:"literal",value:"'outlined'"},{name:"literal",value:"'interactive'"}]},description:"Visual style variant",defaultValue:{value:"'default'",computed:!1}},padding:{required:!1,tsType:{name:"union",raw:"'none' | 'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'none'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"Padding around card content",defaultValue:{value:"'md'",computed:!1}},children:{required:!1,tsType:{name:"ReactNode"},description:"Card content"},animate:{required:!1,tsType:{name:"boolean"},description:"Enable entrance animation",defaultValue:{value:"false",computed:!1}},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Click handler for interactive cards"},className:{defaultValue:{value:"''",computed:!1},required:!1}}};const Ee={component:t,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:{type:"select"},options:["default","elevated","outlined","interactive"],description:"Card visual style"},padding:{control:{type:"select"},options:["none","sm","md","lg"],description:"Padding around content"},animate:{control:{type:"boolean"},description:"Enable entrance animation"}}},d={args:{variant:"default",padding:"md",children:e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-bold text-white",children:"Default Card"}),e.jsx("p",{className:"text-sm text-text-muted mt-2",children:"This is a default card with standard styling"})]})}},i={args:{variant:"default",children:e.jsxs(e.Fragment,{children:[e.jsxs(t.Header,{children:[e.jsx(t.Title,{children:"Card Title"}),e.jsx(t.Description,{children:"Card description goes here"})]}),e.jsx(t.Content,{children:e.jsx("p",{className:"text-white",children:"This is the main content area of the card."})}),e.jsx(t.Footer,{children:e.jsx(s,{size:"sm",children:"Action"})})]})}},n={args:{variant:"default",padding:"sm",children:e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-bold text-white",children:"Small Padding"}),e.jsx("p",{className:"text-sm text-text-muted mt-2",children:"Compact card layout"})]})}},l={args:{variant:"default",padding:"lg",children:e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-bold text-white",children:"Large Padding"}),e.jsx("p",{className:"text-sm text-text-muted mt-2",children:"Spacious card layout"})]})}},c={args:{variant:"elevated",padding:"md",children:e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-bold text-white",children:"Elevated Card"}),e.jsx("p",{className:"text-sm text-text-muted mt-2",children:"This card has an elevated shadow effect"})]})}},o={args:{variant:"elevated",children:e.jsxs(e.Fragment,{children:[e.jsxs(t.Header,{children:[e.jsx(t.Title,{children:"Feature Card"}),e.jsx(t.Description,{children:"Premium elevated design"})]}),e.jsx(t.Content,{children:e.jsx("div",{className:"bg-primary/10 rounded-lg p-4 my-4",children:e.jsx("p",{className:"text-white text-sm",children:"Featured content area"})})}),e.jsx(t.Footer,{children:e.jsx(s,{variant:"primary",size:"sm",children:"Learn More"})})]})}},m={args:{variant:"outlined",padding:"md",children:e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-bold text-white",children:"Outlined Card"}),e.jsx("p",{className:"text-sm text-text-muted mt-2",children:"Transparent background with border only"})]})}},x={args:{variant:"outlined",children:e.jsxs(e.Fragment,{children:[e.jsxs(t.Header,{children:[e.jsx(t.Title,{children:"Outline Style"}),e.jsx(t.Description,{children:"Minimal bordered design"})]}),e.jsx(t.Content,{children:e.jsx("p",{className:"text-white text-sm",children:"Outlined cards work great for secondary content."})}),e.jsx(t.Footer,{children:e.jsx(s,{variant:"secondary",size:"sm",children:"Secondary Action"})})]})}},p={args:{variant:"interactive",padding:"md",children:e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-bold text-white",children:"Interactive Card"}),e.jsx("p",{className:"text-sm text-text-muted mt-2",children:"Hover to see the interactive effect"})]})}},u={args:{variant:"interactive",children:e.jsxs(e.Fragment,{children:[e.jsxs(t.Header,{children:[e.jsx(t.Title,{children:"Clickable Card"}),e.jsx(t.Description,{children:"Interactive hover effects"})]}),e.jsx(t.Content,{children:e.jsx("p",{className:"text-white text-sm",children:"This card has hover and click animations."})})]})}},h={args:{variant:"elevated",animate:!0,children:e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-bold text-white",children:"Animated Card"}),e.jsx("p",{className:"text-sm text-text-muted mt-2",children:"This card fades in and slides up on load"})]})}},v={args:{variant:"elevated",children:e.jsxs(e.Fragment,{children:[e.jsxs(t.Header,{children:[e.jsx(t.Title,{children:"User Profile Card"}),e.jsx(t.Description,{children:"Premium member"})]}),e.jsx(t.Content,{children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 rounded-full bg-primary/20"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-white font-semibold",children:"John Doe"}),e.jsx("p",{className:"text-sm text-text-muted",children:"john@example.com"})]})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-4 py-4 border-y border-border",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("p",{className:"text-white font-bold",children:"1,234"}),e.jsx("p",{className:"text-xs text-text-muted",children:"Followers"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("p",{className:"text-white font-bold",children:"567"}),e.jsx("p",{className:"text-xs text-text-muted",children:"Following"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("p",{className:"text-white font-bold",children:"89"}),e.jsx("p",{className:"text-xs text-text-muted",children:"Posts"})]})]})]})}),e.jsx(t.Footer,{children:e.jsxs("div",{className:"flex gap-2 w-full",children:[e.jsx(s,{variant:"primary",size:"sm",fullWidth:!0,children:"Follow"}),e.jsx(s,{variant:"secondary",size:"sm",fullWidth:!0,children:"Message"})]})})]})}},g={render:()=>e.jsxs("div",{className:"grid grid-cols-2 gap-4 w-full max-w-2xl",children:[e.jsxs(t,{variant:"default",padding:"md",children:[e.jsx(t.Header,{children:e.jsx(t.Title,{children:"Default"})}),e.jsx(t.Content,{children:e.jsx("p",{className:"text-sm text-text-muted",children:"Default styling"})})]}),e.jsxs(t,{variant:"elevated",padding:"md",children:[e.jsx(t.Header,{children:e.jsx(t.Title,{children:"Elevated"})}),e.jsx(t.Content,{children:e.jsx("p",{className:"text-sm text-text-muted",children:"With shadow"})})]}),e.jsxs(t,{variant:"outlined",padding:"md",children:[e.jsx(t.Header,{children:e.jsx(t.Title,{children:"Outlined"})}),e.jsx(t.Content,{children:e.jsx("p",{className:"text-sm text-text-muted",children:"Border only"})})]}),e.jsxs(t,{variant:"interactive",padding:"md",children:[e.jsx(t.Header,{children:e.jsx(t.Title,{children:"Interactive"})}),e.jsx(t.Content,{children:e.jsx("p",{className:"text-sm text-text-muted",children:"Hover effects"})})]})]})},C={render:()=>e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl",children:[1,2,3,4,5,6].map(r=>e.jsxs(t,{variant:"elevated",animate:!0,children:[e.jsx(t.Header,{children:e.jsxs(t.Title,{children:["Card ",r]})}),e.jsx(t.Content,{children:e.jsxs("p",{className:"text-sm text-text-muted",children:["This is card number ",r," in a responsive grid"]})})]},r))})},f={args:{variant:"outlined",padding:"lg",children:e.jsxs("div",{className:"text-center py-8",children:[e.jsx("div",{className:"w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4"}),e.jsx("h3",{className:"text-lg font-bold text-white mb-2",children:"Empty State"}),e.jsx("p",{className:"text-sm text-text-muted mb-6",children:"No data available at the moment"}),e.jsx(s,{variant:"primary",size:"sm",children:"Create New"})]})}};var D,F,P;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    variant: 'default',
    padding: 'md',
    children: <div>\r
        <h3 className="text-lg font-bold text-white">Default Card</h3>\r
        <p className="text-sm text-text-muted mt-2">\r
          This is a default card with standard styling\r
        </p>\r
      </div>
  }
}`,...(P=(F=d.parameters)==null?void 0:F.docs)==null?void 0:P.source}}};var B,E,W;i.parameters={...i.parameters,docs:{...(B=i.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    variant: 'default',
    children: <>\r
        <Card.Header>\r
          <Card.Title>Card Title</Card.Title>\r
          <Card.Description>Card description goes here</Card.Description>\r
        </Card.Header>\r
        <Card.Content>\r
          <p className="text-white">This is the main content area of the card.</p>\r
        </Card.Content>\r
        <Card.Footer>\r
          <Button size="sm">Action</Button>\r
        </Card.Footer>\r
      </>
  }
}`,...(W=(E=i.parameters)==null?void 0:E.docs)==null?void 0:W.source}}};var O,z,I;n.parameters={...n.parameters,docs:{...(O=n.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    variant: 'default',
    padding: 'sm',
    children: <div>\r
        <h3 className="text-lg font-bold text-white">Small Padding</h3>\r
        <p className="text-sm text-text-muted mt-2">Compact card layout</p>\r
      </div>
  }
}`,...(I=(z=n.parameters)==null?void 0:z.docs)==null?void 0:I.source}}};var k,A,L;l.parameters={...l.parameters,docs:{...(k=l.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    variant: 'default',
    padding: 'lg',
    children: <div>\r
        <h3 className="text-lg font-bold text-white">Large Padding</h3>\r
        <p className="text-sm text-text-muted mt-2">Spacious card layout</p>\r
      </div>
  }
}`,...(L=(A=l.parameters)==null?void 0:A.docs)==null?void 0:L.source}}};var $,V,q;c.parameters={...c.parameters,docs:{...($=c.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    variant: 'elevated',
    padding: 'md',
    children: <div>\r
        <h3 className="text-lg font-bold text-white">Elevated Card</h3>\r
        <p className="text-sm text-text-muted mt-2">\r
          This card has an elevated shadow effect\r
        </p>\r
      </div>
  }
}`,...(q=(V=c.parameters)==null?void 0:V.docs)==null?void 0:q.source}}};var M,R,_;o.parameters={...o.parameters,docs:{...(M=o.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    variant: 'elevated',
    children: <>\r
        <Card.Header>\r
          <Card.Title>Feature Card</Card.Title>\r
          <Card.Description>Premium elevated design</Card.Description>\r
        </Card.Header>\r
        <Card.Content>\r
          <div className="bg-primary/10 rounded-lg p-4 my-4">\r
            <p className="text-white text-sm">Featured content area</p>\r
          </div>\r
        </Card.Content>\r
        <Card.Footer>\r
          <Button variant="primary" size="sm">Learn More</Button>\r
        </Card.Footer>\r
      </>
  }
}`,...(_=(R=o.parameters)==null?void 0:R.docs)==null?void 0:_.source}}};var G,J,U;m.parameters={...m.parameters,docs:{...(G=m.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    variant: 'outlined',
    padding: 'md',
    children: <div>\r
        <h3 className="text-lg font-bold text-white">Outlined Card</h3>\r
        <p className="text-sm text-text-muted mt-2">\r
          Transparent background with border only\r
        </p>\r
      </div>
  }
}`,...(U=(J=m.parameters)==null?void 0:J.docs)==null?void 0:U.source}}};var K,Q,X;x.parameters={...x.parameters,docs:{...(K=x.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    variant: 'outlined',
    children: <>\r
        <Card.Header>\r
          <Card.Title>Outline Style</Card.Title>\r
          <Card.Description>Minimal bordered design</Card.Description>\r
        </Card.Header>\r
        <Card.Content>\r
          <p className="text-white text-sm">Outlined cards work great for secondary content.</p>\r
        </Card.Content>\r
        <Card.Footer>\r
          <Button variant="secondary" size="sm">Secondary Action</Button>\r
        </Card.Footer>\r
      </>
  }
}`,...(X=(Q=x.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,ee;p.parameters={...p.parameters,docs:{...(Y=p.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    variant: 'interactive',
    padding: 'md',
    children: <div>\r
        <h3 className="text-lg font-bold text-white">Interactive Card</h3>\r
        <p className="text-sm text-text-muted mt-2">\r
          Hover to see the interactive effect\r
        </p>\r
      </div>
  }
}`,...(ee=(Z=p.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var te,re,ae;u.parameters={...u.parameters,docs:{...(te=u.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    variant: 'interactive',
    children: <>\r
        <Card.Header>\r
          <Card.Title>Clickable Card</Card.Title>\r
          <Card.Description>Interactive hover effects</Card.Description>\r
        </Card.Header>\r
        <Card.Content>\r
          <p className="text-white text-sm">This card has hover and click animations.</p>\r
        </Card.Content>\r
      </>
  }
}`,...(ae=(re=u.parameters)==null?void 0:re.docs)==null?void 0:ae.source}}};var se,de,ie;h.parameters={...h.parameters,docs:{...(se=h.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    variant: 'elevated',
    animate: true,
    children: <div>\r
        <h3 className="text-lg font-bold text-white">Animated Card</h3>\r
        <p className="text-sm text-text-muted mt-2">\r
          This card fades in and slides up on load\r
        </p>\r
      </div>
  }
}`,...(ie=(de=h.parameters)==null?void 0:de.docs)==null?void 0:ie.source}}};var ne,le,ce;v.parameters={...v.parameters,docs:{...(ne=v.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    variant: 'elevated',
    children: <>\r
        <Card.Header>\r
          <Card.Title>User Profile Card</Card.Title>\r
          <Card.Description>Premium member</Card.Description>\r
        </Card.Header>\r
        <Card.Content>\r
          <div className="space-y-4">\r
            <div className="flex items-center gap-4">\r
              <div className="w-12 h-12 rounded-full bg-primary/20"></div>\r
              <div>\r
                <p className="text-white font-semibold">John Doe</p>\r
                <p className="text-sm text-text-muted">john@example.com</p>\r
              </div>\r
            </div>\r
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">\r
              <div className="text-center">\r
                <p className="text-white font-bold">1,234</p>\r
                <p className="text-xs text-text-muted">Followers</p>\r
              </div>\r
              <div className="text-center">\r
                <p className="text-white font-bold">567</p>\r
                <p className="text-xs text-text-muted">Following</p>\r
              </div>\r
              <div className="text-center">\r
                <p className="text-white font-bold">89</p>\r
                <p className="text-xs text-text-muted">Posts</p>\r
              </div>\r
            </div>\r
          </div>\r
        </Card.Content>\r
        <Card.Footer>\r
          <div className="flex gap-2 w-full">\r
            <Button variant="primary" size="sm" fullWidth>\r
              Follow\r
            </Button>\r
            <Button variant="secondary" size="sm" fullWidth>\r
              Message\r
            </Button>\r
          </div>\r
        </Card.Footer>\r
      </>
  }
}`,...(ce=(le=v.parameters)==null?void 0:le.docs)==null?void 0:ce.source}}};var oe,me,xe;g.parameters={...g.parameters,docs:{...(oe=g.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">\r
      <Card variant="default" padding="md">\r
        <Card.Header>\r
          <Card.Title>Default</Card.Title>\r
        </Card.Header>\r
        <Card.Content>\r
          <p className="text-sm text-text-muted">Default styling</p>\r
        </Card.Content>\r
      </Card>\r
\r
      <Card variant="elevated" padding="md">\r
        <Card.Header>\r
          <Card.Title>Elevated</Card.Title>\r
        </Card.Header>\r
        <Card.Content>\r
          <p className="text-sm text-text-muted">With shadow</p>\r
        </Card.Content>\r
      </Card>\r
\r
      <Card variant="outlined" padding="md">\r
        <Card.Header>\r
          <Card.Title>Outlined</Card.Title>\r
        </Card.Header>\r
        <Card.Content>\r
          <p className="text-sm text-text-muted">Border only</p>\r
        </Card.Content>\r
      </Card>\r
\r
      <Card variant="interactive" padding="md">\r
        <Card.Header>\r
          <Card.Title>Interactive</Card.Title>\r
        </Card.Header>\r
        <Card.Content>\r
          <p className="text-sm text-text-muted">Hover effects</p>\r
        </Card.Content>\r
      </Card>\r
    </div>
}`,...(xe=(me=g.parameters)==null?void 0:me.docs)==null?void 0:xe.source}}};var pe,ue,he;C.parameters={...C.parameters,docs:{...(pe=C.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">\r
      {[1, 2, 3, 4, 5, 6].map(item => <Card key={item} variant="elevated" animate>\r
          <Card.Header>\r
            <Card.Title>Card {item}</Card.Title>\r
          </Card.Header>\r
          <Card.Content>\r
            <p className="text-sm text-text-muted">\r
              This is card number {item} in a responsive grid\r
            </p>\r
          </Card.Content>\r
        </Card>)}\r
    </div>
}`,...(he=(ue=C.parameters)==null?void 0:ue.docs)==null?void 0:he.source}}};var ve,ge,Ce;f.parameters={...f.parameters,docs:{...(ve=f.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  args: {
    variant: 'outlined',
    padding: 'lg',
    children: <div className="text-center py-8">\r
        <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4"></div>\r
        <h3 className="text-lg font-bold text-white mb-2">Empty State</h3>\r
        <p className="text-sm text-text-muted mb-6">\r
          No data available at the moment\r
        </p>\r
        <Button variant="primary" size="sm">Create New</Button>\r
      </div>
  }
}`,...(Ce=(ge=f.parameters)==null?void 0:ge.docs)==null?void 0:Ce.source}}};const We=["Default","DefaultWithStructure","DefaultSmallPadding","DefaultLargePadding","Elevated","ElevatedWithStructure","Outlined","OutlinedWithStructure","Interactive","InteractiveWithStructure","WithAnimation","ComplexLayout","AllVariants","GridLayout","EmptyState"];export{g as AllVariants,v as ComplexLayout,d as Default,l as DefaultLargePadding,n as DefaultSmallPadding,i as DefaultWithStructure,c as Elevated,o as ElevatedWithStructure,f as EmptyState,C as GridLayout,p as Interactive,u as InteractiveWithStructure,m as Outlined,x as OutlinedWithStructure,h as WithAnimation,We as __namedExportsOrder,Ee as default};
