import{j as e}from"./jsx-runtime-B4hUth8J.js";import{r as W}from"./iframe-BIROZn-X.js";import"./preload-helper-C1FmrZbK.js";function r({checked:Ir=!1,indeterminate:E=!1,size:P="md",state:Lr="default",label:g,labelPosition:R="right",helperText:w,error:a,disabled:A=!1,required:Er=!1,onChange:I,onFocus:Pr,onBlur:Rr,className:Ar="",name:Dr,value:Mr,id:s}){const L=W.useRef(null);W.useEffect(()=>{L.current&&(L.current.indeterminate=E)},[E]);const D=a?"error":Lr,Fr={sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6"},Wr={default:"border-ds-gray-300 accent-ds-primary",error:"border-red-500 accent-red-500",success:"border-green-500 accent-green-500"},Or={sm:"text-sm",md:"text-base",lg:"text-lg"},Hr=Vr=>{I==null||I(Vr.target.checked)},M=g&&(Er?`${g} *`:g),$r=e.jsx("input",{ref:L,type:"checkbox",checked:Ir,onChange:Hr,onFocus:Pr,onBlur:Rr,disabled:A,name:Dr,value:Mr,id:s,"aria-label":g,"aria-invalid":D==="error","aria-describedby":a?`${s}-error`:w?`${s}-helper`:void 0,className:`
        ${Fr[P]}
        border rounded transition-colors
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ds-primary
        disabled:opacity-50 disabled:cursor-not-allowed
        ${Wr[D]}
        ${Ar}
      `}),F=M&&e.jsx("label",{htmlFor:s,className:`
        select-none cursor-pointer
        ${Or[P]}
        ${A?"cursor-not-allowed opacity-50":""}
      `,children:M});return e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[R==="left"&&F,$r,R==="right"&&F]}),a&&e.jsxs("p",{id:`${s}-error`,className:"mt-1 text-xs text-red-500 flex items-center",children:[e.jsx("svg",{className:"w-4 h-4 mr-1",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",clipRule:"evenodd"})}),a]}),w&&!a&&e.jsx("p",{id:`${s}-helper`,className:"mt-1 text-xs text-ds-gray-600",children:w})]})}r.displayName="Checkbox";r.__docgenInfo={description:`Checkbox Component - Selectable input for multiple options\r
Supports 3 sizes (sm, md, lg)\r
3 states (default, error, success)\r
Indeterminate state for partial selections\r
Full keyboard navigation and accessibility\r
\r
Accessibility:\r
- Semantic input element with checkbox role\r
- Associated label for screen readers\r
- ARIA attributes for state\r
- Full keyboard support (Space to toggle)\r
- Focus indicators`,methods:[],displayName:"Checkbox",props:{checked:{required:!1,tsType:{name:"boolean"},description:"Whether checkbox is checked",defaultValue:{value:"false",computed:!1}},indeterminate:{required:!1,tsType:{name:"boolean"},description:`Indeterminate state (partial selection)\r
@default false`,defaultValue:{value:"false",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:`Checkbox size\r
@default 'md'`,defaultValue:{value:"'md'",computed:!1}},state:{required:!1,tsType:{name:"union",raw:"'default' | 'error' | 'success'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'error'"},{name:"literal",value:"'success'"}]},description:`Checkbox state\r
@default 'default'`,defaultValue:{value:"'default'",computed:!1}},label:{required:!1,tsType:{name:"string"},description:"Label text"},labelPosition:{required:!1,tsType:{name:"union",raw:"'left' | 'right'",elements:[{name:"literal",value:"'left'"},{name:"literal",value:"'right'"}]},description:`Label position\r
@default 'right'`,defaultValue:{value:"'right'",computed:!1}},helperText:{required:!1,tsType:{name:"string"},description:"Helper text below checkbox"},error:{required:!1,tsType:{name:"string"},description:"Error message"},disabled:{required:!1,tsType:{name:"boolean"},description:`Disabled state\r
@default false`,defaultValue:{value:"false",computed:!1}},required:{required:!1,tsType:{name:"boolean"},description:`Required field\r
@default false`,defaultValue:{value:"false",computed:!1}},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(checked: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"checked"}],return:{name:"void"}}},description:"Callback when checked state changes"},onFocus:{required:!1,tsType:{name:"signature",type:"function",raw:"(e: React.FocusEvent<HTMLInputElement>) => void",signature:{arguments:[{type:{name:"ReactFocusEvent",raw:"React.FocusEvent<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},name:"e"}],return:{name:"void"}}},description:"Callback on focus"},onBlur:{required:!1,tsType:{name:"signature",type:"function",raw:"(e: React.FocusEvent<HTMLInputElement>) => void",signature:{arguments:[{type:{name:"ReactFocusEvent",raw:"React.FocusEvent<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},name:"e"}],return:{name:"void"}}},description:"Callback on blur"},className:{required:!1,tsType:{name:"string"},description:"Custom CSS class",defaultValue:{value:"''",computed:!1}},name:{required:!1,tsType:{name:"string"},description:"Input name attribute"},value:{required:!1,tsType:{name:"string"},description:"Input value attribute"},id:{required:!1,tsType:{name:"string"},description:"Input id attribute"}},composes:["Omit"]};const _r={component:r,title:"Components/Checkbox",tags:["autodocs"],argTypes:{size:{control:"select",options:["sm","md","lg"],description:"Checkbox size"},state:{control:"select",options:["default","error","success"],description:"Checkbox state"},labelPosition:{control:"select",options:["left","right"],description:"Label position"},disabled:{control:"boolean",description:"Disabled state"},required:{control:"boolean",description:"Required field"},indeterminate:{control:"boolean",description:"Indeterminate state"}}},t={args:{label:"Accept terms and conditions"}},f={args:{label:"Option is checked",checked:!0}},k={args:{label:"Indeterminate state",indeterminate:!0}},c={args:{size:"sm",label:"Small checkbox"}},S={args:{size:"md",label:"Medium checkbox"}},y={args:{size:"lg",label:"Large checkbox"}},l={args:{label:"Default state",state:"default"}},v={args:{label:"With error",state:"error",error:"This field is required"}},C={args:{label:"Successfully validated",state:"success",checked:!0}},o={args:{label:"Label on right",labelPosition:"right"}},j={args:{label:"Label on left",labelPosition:"left"}},n={args:{label:"I agree to the terms",helperText:"Please read our terms and conditions carefully"}},z={args:{label:"Accept updates",error:"You must accept to continue"}},T={args:{label:"Disabled checkbox",disabled:!0}},q={args:{label:"Disabled but checked",disabled:!0,checked:!0}},N={args:{label:"Required field",required:!0}},i={render:()=>e.jsxs("div",{className:"space-y-4 p-4",children:[e.jsx(r,{id:"terms",label:"I agree to the Terms of Service",helperText:"You must accept to create an account",required:!0}),e.jsx(r,{id:"privacy",label:"I agree to the Privacy Policy",helperText:"We take your privacy seriously",required:!0}),e.jsx(r,{id:"newsletter",label:"Subscribe to our newsletter",helperText:"Get updates about new features and releases"})]})},d={render:()=>e.jsxs("div",{className:"space-y-3 p-4 max-w-sm",children:[e.jsx("div",{className:"mb-4",children:e.jsx("h3",{className:"font-semibold mb-3",children:"Notification Preferences"})}),e.jsx(r,{label:"Email notifications",checked:!0}),e.jsx(r,{label:"SMS notifications"}),e.jsx(r,{label:"Push notifications",checked:!0}),e.jsx(r,{label:"Weekly digest"})]})},m={render:()=>e.jsxs("div",{className:"space-y-3 p-4 max-w-sm",children:[e.jsx("div",{className:"mb-4",children:e.jsx("h3",{className:"font-semibold mb-3",children:"User Permissions"})}),e.jsx(r,{label:"Read"}),e.jsx(r,{label:"Write"}),e.jsx(r,{label:"Delete"}),e.jsx(r,{label:"Admin"})]})},u={render:()=>e.jsxs("div",{className:"space-y-3 p-4 max-w-sm border rounded-lg",children:[e.jsx(r,{id:"select-all",label:"Select All",size:"md",indeterminate:!0}),e.jsxs("div",{className:"ml-6 space-y-2",children:[e.jsx(r,{label:"Option 1"}),e.jsx(r,{label:"Option 2"}),e.jsx(r,{label:"Option 3"}),e.jsx(r,{label:"Option 4"})]})]})},p={render:()=>e.jsxs("div",{className:"space-y-4 p-4",children:[e.jsx(r,{size:"sm",label:"Small checkbox"}),e.jsx(r,{size:"md",label:"Medium checkbox"}),e.jsx(r,{size:"lg",label:"Large checkbox"})]})},b={render:()=>e.jsxs("div",{className:"space-y-4 p-4",children:[e.jsx(r,{label:"Default"}),e.jsx(r,{label:"Checked",checked:!0}),e.jsx(r,{label:"Indeterminate",indeterminate:!0}),e.jsx(r,{label:"Disabled",disabled:!0}),e.jsx(r,{label:"Error",error:"This is required"}),e.jsx(r,{label:"Success",state:"success",checked:!0})]})},h={render:()=>e.jsxs("div",{className:"flex items-center gap-8 p-4",children:[e.jsx(r,{size:"sm",label:"Small",checked:!0}),e.jsx(r,{size:"md",label:"Medium",checked:!0}),e.jsx(r,{size:"lg",label:"Large",checked:!0})]})},x={args:{label:"Click me to toggle",size:"md"}};var O,H,$,V,B;t.parameters={...t.parameters,docs:{...(O=t.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    label: 'Accept terms and conditions'
  }
}`,...($=(H=t.parameters)==null?void 0:H.docs)==null?void 0:$.source},description:{story:"Basic Checkbox Stories",...(B=(V=t.parameters)==null?void 0:V.docs)==null?void 0:B.description}}};var G,Y,_;f.parameters={...f.parameters,docs:{...(G=f.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    label: 'Option is checked',
    checked: true
  }
}`,...(_=(Y=f.parameters)==null?void 0:Y.docs)==null?void 0:_.source}}};var U,J,K;k.parameters={...k.parameters,docs:{...(U=k.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    label: 'Indeterminate state',
    indeterminate: true
  }
}`,...(K=(J=k.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,X,Z,ee,re;c.parameters={...c.parameters,docs:{...(Q=c.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    size: 'sm',
    label: 'Small checkbox'
  }
}`,...(Z=(X=c.parameters)==null?void 0:X.docs)==null?void 0:Z.source},description:{story:"Size Stories",...(re=(ee=c.parameters)==null?void 0:ee.docs)==null?void 0:re.description}}};var se,ae,te;S.parameters={...S.parameters,docs:{...(se=S.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    size: 'md',
    label: 'Medium checkbox'
  }
}`,...(te=(ae=S.parameters)==null?void 0:ae.docs)==null?void 0:te.source}}};var ce,le,oe;y.parameters={...y.parameters,docs:{...(ce=y.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    label: 'Large checkbox'
  }
}`,...(oe=(le=y.parameters)==null?void 0:le.docs)==null?void 0:oe.source}}};var ne,ie,de,me,ue;l.parameters={...l.parameters,docs:{...(ne=l.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    label: 'Default state',
    state: 'default'
  }
}`,...(de=(ie=l.parameters)==null?void 0:ie.docs)==null?void 0:de.source},description:{story:"State Stories",...(ue=(me=l.parameters)==null?void 0:me.docs)==null?void 0:ue.description}}};var pe,be,he;v.parameters={...v.parameters,docs:{...(pe=v.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    label: 'With error',
    state: 'error',
    error: 'This field is required'
  }
}`,...(he=(be=v.parameters)==null?void 0:be.docs)==null?void 0:he.source}}};var xe,ge,fe;C.parameters={...C.parameters,docs:{...(xe=C.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  args: {
    label: 'Successfully validated',
    state: 'success',
    checked: true
  }
}`,...(fe=(ge=C.parameters)==null?void 0:ge.docs)==null?void 0:fe.source}}};var ke,Se,ye,ve,Ce;o.parameters={...o.parameters,docs:{...(ke=o.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  args: {
    label: 'Label on right',
    labelPosition: 'right'
  }
}`,...(ye=(Se=o.parameters)==null?void 0:Se.docs)==null?void 0:ye.source},description:{story:"Label Position Stories",...(Ce=(ve=o.parameters)==null?void 0:ve.docs)==null?void 0:Ce.description}}};var je,ze,Te;j.parameters={...j.parameters,docs:{...(je=j.parameters)==null?void 0:je.docs,source:{originalSource:`{
  args: {
    label: 'Label on left',
    labelPosition: 'left'
  }
}`,...(Te=(ze=j.parameters)==null?void 0:ze.docs)==null?void 0:Te.source}}};var qe,Ne,we,Ie,Le;n.parameters={...n.parameters,docs:{...(qe=n.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  args: {
    label: 'I agree to the terms',
    helperText: 'Please read our terms and conditions carefully'
  }
}`,...(we=(Ne=n.parameters)==null?void 0:Ne.docs)==null?void 0:we.source},description:{story:"Feature Stories",...(Le=(Ie=n.parameters)==null?void 0:Ie.docs)==null?void 0:Le.description}}};var Ee,Pe,Re;z.parameters={...z.parameters,docs:{...(Ee=z.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  args: {
    label: 'Accept updates',
    error: 'You must accept to continue'
  }
}`,...(Re=(Pe=z.parameters)==null?void 0:Pe.docs)==null?void 0:Re.source}}};var Ae,De,Me;T.parameters={...T.parameters,docs:{...(Ae=T.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
  args: {
    label: 'Disabled checkbox',
    disabled: true
  }
}`,...(Me=(De=T.parameters)==null?void 0:De.docs)==null?void 0:Me.source}}};var Fe,We,Oe;q.parameters={...q.parameters,docs:{...(Fe=q.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  args: {
    label: 'Disabled but checked',
    disabled: true,
    checked: true
  }
}`,...(Oe=(We=q.parameters)==null?void 0:We.docs)==null?void 0:Oe.source}}};var He,$e,Ve;N.parameters={...N.parameters,docs:{...(He=N.parameters)==null?void 0:He.docs,source:{originalSource:`{
  args: {
    label: 'Required field',
    required: true
  }
}`,...(Ve=($e=N.parameters)==null?void 0:$e.docs)==null?void 0:Ve.source}}};var Be,Ge,Ye,_e,Ue;i.parameters={...i.parameters,docs:{...(Be=i.parameters)==null?void 0:Be.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 p-4">\r
      <Checkbox id="terms" label="I agree to the Terms of Service" helperText="You must accept to create an account" required />\r
      <Checkbox id="privacy" label="I agree to the Privacy Policy" helperText="We take your privacy seriously" required />\r
      <Checkbox id="newsletter" label="Subscribe to our newsletter" helperText="Get updates about new features and releases" />\r
    </div>
}`,...(Ye=(Ge=i.parameters)==null?void 0:Ge.docs)==null?void 0:Ye.source},description:{story:"Form Examples",...(Ue=(_e=i.parameters)==null?void 0:_e.docs)==null?void 0:Ue.description}}};var Je,Ke,Qe,Xe,Ze;d.parameters={...d.parameters,docs:{...(Je=d.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  render: () => <div className="space-y-3 p-4 max-w-sm">\r
      <div className="mb-4">\r
        <h3 className="font-semibold mb-3">Notification Preferences</h3>\r
      </div>\r
      <Checkbox label="Email notifications" checked={true} />\r
      <Checkbox label="SMS notifications" />\r
      <Checkbox label="Push notifications" checked={true} />\r
      <Checkbox label="Weekly digest" />\r
    </div>
}`,...(Qe=(Ke=d.parameters)==null?void 0:Ke.docs)==null?void 0:Qe.source},description:{story:"Preferences Form",...(Ze=(Xe=d.parameters)==null?void 0:Xe.docs)==null?void 0:Ze.description}}};var er,rr,sr,ar,tr;m.parameters={...m.parameters,docs:{...(er=m.parameters)==null?void 0:er.docs,source:{originalSource:`{
  render: () => <div className="space-y-3 p-4 max-w-sm">\r
      <div className="mb-4">\r
        <h3 className="font-semibold mb-3">User Permissions</h3>\r
      </div>\r
      <Checkbox label="Read" />\r
      <Checkbox label="Write" />\r
      <Checkbox label="Delete" />\r
      <Checkbox label="Admin" />\r
    </div>
}`,...(sr=(rr=m.parameters)==null?void 0:rr.docs)==null?void 0:sr.source},description:{story:"Permissions Checkboxes",...(tr=(ar=m.parameters)==null?void 0:ar.docs)==null?void 0:tr.description}}};var cr,lr,or,nr,ir;u.parameters={...u.parameters,docs:{...(cr=u.parameters)==null?void 0:cr.docs,source:{originalSource:`{
  render: () => <div className="space-y-3 p-4 max-w-sm border rounded-lg">\r
      <Checkbox id="select-all" label="Select All" size="md" indeterminate={true} />\r
      <div className="ml-6 space-y-2">\r
        <Checkbox label="Option 1" />\r
        <Checkbox label="Option 2" />\r
        <Checkbox label="Option 3" />\r
        <Checkbox label="Option 4" />\r
      </div>\r
    </div>
}`,...(or=(lr=u.parameters)==null?void 0:lr.docs)==null?void 0:or.source},description:{story:"Group Select All Pattern",...(ir=(nr=u.parameters)==null?void 0:nr.docs)==null?void 0:ir.description}}};var dr,mr,ur,pr,br;p.parameters={...p.parameters,docs:{...(dr=p.parameters)==null?void 0:dr.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 p-4">\r
      <Checkbox size="sm" label="Small checkbox" />\r
      <Checkbox size="md" label="Medium checkbox" />\r
      <Checkbox size="lg" label="Large checkbox" />\r
    </div>
}`,...(ur=(mr=p.parameters)==null?void 0:mr.docs)==null?void 0:ur.source},description:{story:"All Sizes Showcase",...(br=(pr=p.parameters)==null?void 0:pr.docs)==null?void 0:br.description}}};var hr,xr,gr,fr,kr;b.parameters={...b.parameters,docs:{...(hr=b.parameters)==null?void 0:hr.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 p-4">\r
      <Checkbox label="Default" />\r
      <Checkbox label="Checked" checked={true} />\r
      <Checkbox label="Indeterminate" indeterminate={true} />\r
      <Checkbox label="Disabled" disabled={true} />\r
      <Checkbox label="Error" error="This is required" />\r
      <Checkbox label="Success" state="success" checked={true} />\r
    </div>
}`,...(gr=(xr=b.parameters)==null?void 0:xr.docs)==null?void 0:gr.source},description:{story:"All States Showcase",...(kr=(fr=b.parameters)==null?void 0:fr.docs)==null?void 0:kr.description}}};var Sr,yr,vr,Cr,jr;h.parameters={...h.parameters,docs:{...(Sr=h.parameters)==null?void 0:Sr.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-8 p-4">\r
      <Checkbox size="sm" label="Small" checked={true} />\r
      <Checkbox size="md" label="Medium" checked={true} />\r
      <Checkbox size="lg" label="Large" checked={true} />\r
    </div>
}`,...(vr=(yr=h.parameters)==null?void 0:yr.docs)==null?void 0:vr.source},description:{story:"Checkbox Sizes",...(jr=(Cr=h.parameters)==null?void 0:Cr.docs)==null?void 0:jr.description}}};var zr,Tr,qr,Nr,wr;x.parameters={...x.parameters,docs:{...(zr=x.parameters)==null?void 0:zr.docs,source:{originalSource:`{
  args: {
    label: 'Click me to toggle',
    size: 'md'
  }
}`,...(qr=(Tr=x.parameters)==null?void 0:Tr.docs)==null?void 0:qr.source},description:{story:"Interactive Example",...(wr=(Nr=x.parameters)==null?void 0:Nr.docs)==null?void 0:wr.description}}};const Ur=["Basic","Checked","Indeterminate","SmallSize","MediumSize","LargeSize","DefaultState","ErrorState","SuccessState","LabelRight","LabelLeft","WithHelper","WithError","Disabled","DisabledChecked","Required","TermsCheckbox","PreferencesForm","PermissionsCheckboxes","GroupSelectAll","AllSizes","AllStates","SizeComparison","Interactive"];export{p as AllSizes,b as AllStates,t as Basic,f as Checked,l as DefaultState,T as Disabled,q as DisabledChecked,v as ErrorState,u as GroupSelectAll,k as Indeterminate,x as Interactive,j as LabelLeft,o as LabelRight,y as LargeSize,S as MediumSize,m as PermissionsCheckboxes,d as PreferencesForm,N as Required,h as SizeComparison,c as SmallSize,C as SuccessState,i as TermsCheckbox,z as WithError,n as WithHelper,Ur as __namedExportsOrder,_r as default};
