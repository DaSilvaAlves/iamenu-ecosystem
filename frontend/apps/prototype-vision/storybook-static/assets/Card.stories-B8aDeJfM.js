import{j as e}from"./jsx-runtime-B4hUth8J.js";import{B}from"./Button-D34buaR2.js";import{c as D}from"./createLucideIcon-D_yLTFe7.js";import"./iframe-BIROZn-X.js";import"./preload-helper-C1FmrZbK.js";function a({variant:wa="elevated",size:r="md",children:Sa,header:P,footer:q,image:b,clickable:v=!1,hoverable:za=!0,disabled:s=!1,loading:t=!1,onClick:d,rounded:ka="md",className:Ta=""}){const La="transition-all duration-200",Va={elevated:"bg-white shadow-md hover:shadow-lg border border-transparent",outlined:"bg-white shadow-none border border-ds-gray-300 hover:border-ds-gray-400",filled:"bg-ds-gray-100 shadow-none border border-transparent hover:bg-ds-gray-200"},Ba={sm:"p-3",md:"p-4",lg:"p-6"},qa={none:"rounded-none",sm:"rounded-sm",md:"rounded-md",lg:"rounded-lg",full:"rounded-full"},Aa=v&&za&&!s?"cursor-pointer":"",A=`${La} ${Va[wa]} ${Ba[r]} ${qa[ka]} ${Aa} ${Ta}`,Ma=()=>{v&&!s&&!t&&d&&d()},Da=M=>{v&&!s&&!t&&(M.key==="Enter"||M.key===" ")&&(M.preventDefault(),d==null||d())},$={className:A,"aria-disabled":s,"aria-busy":t},R=e.jsxs(e.Fragment,{children:[b&&e.jsx("div",{className:"overflow-hidden -m-4 mb-4",style:{marginBottom:r==="sm"?"0.75rem":r==="lg"?"1.5rem":"1rem"},children:e.jsx("img",{src:b.src,alt:b.alt,height:b.height||200,className:"w-full object-cover"})}),P&&e.jsx("div",{className:`mb-4 ${r==="sm"?"mb-2":r==="lg"?"mb-6":""}`,children:P}),e.jsx("div",{className:`${q?"mb-4":""} ${r==="sm"?"mb-2":r==="lg"?"mb-4":""}`,children:Sa}),q&&e.jsx("div",{className:`pt-4 border-t border-ds-gray-200 ${r==="sm"?"pt-2":r==="lg"?"pt-6":""}`,children:q}),t&&e.jsx("div",{className:"absolute inset-0 bg-white/50 rounded-md flex items-center justify-center",children:e.jsxs("svg",{className:"animate-spin h-6 w-6 text-ds-primary",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","aria-hidden":"true",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]})})]});return v?e.jsx("button",{...$,onClick:Ma,onKeyDown:Da,disabled:s||t,className:`${A} relative w-full text-left ${s?"opacity-50 cursor-not-allowed":""}`,type:"button",role:"button",tabIndex:s?-1:0,children:R}):e.jsx("div",{...$,className:`${A} relative ${s?"opacity-50":""}`,children:R})}a.__docgenInfo={description:`Card Component - Container for content with visual separation\r
Supports 3 variants (elevated, outlined, filled)\r
3 sizes (sm, md, lg)\r
Optional header, footer, and image\r
Clickable and interactive states\r
\r
Accessibility:\r
- Semantic section element or button if clickable\r
- Proper ARIA attributes for interactive cards\r
- Keyboard accessible when clickable\r
- Clear focus indicators`,methods:[],displayName:"Card",props:{variant:{required:!1,tsType:{name:"union",raw:"'elevated' | 'outlined' | 'filled'",elements:[{name:"literal",value:"'elevated'"},{name:"literal",value:"'outlined'"},{name:"literal",value:"'filled'"}]},description:`Card visual variant\r
@default 'elevated'`,defaultValue:{value:"'elevated'",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:`Card size (padding)\r
@default 'md'`,defaultValue:{value:"'md'",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:"Card content"},header:{required:!1,tsType:{name:"ReactNode"},description:"Optional header element"},footer:{required:!1,tsType:{name:"ReactNode"},description:"Optional footer element"},image:{required:!1,tsType:{name:"signature",type:"object",raw:`{\r
  src: string;\r
  alt: string;\r
  height?: number;\r
}`,signature:{properties:[{key:"src",value:{name:"string",required:!0}},{key:"alt",value:{name:"string",required:!0}},{key:"height",value:{name:"number",required:!1}}]}},description:"Optional image/banner at the top"},clickable:{required:!1,tsType:{name:"boolean"},description:`Whether card is clickable\r
@default false`,defaultValue:{value:"false",computed:!1}},hoverable:{required:!1,tsType:{name:"boolean"},description:`Hover effect on clickable cards\r
@default true`,defaultValue:{value:"true",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:`Disabled state\r
@default false`,defaultValue:{value:"false",computed:!1}},loading:{required:!1,tsType:{name:"boolean"},description:`Loading state (shows overlay)\r
@default false`,defaultValue:{value:"false",computed:!1}},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when card is clicked (if clickable)"},rounded:{required:!1,tsType:{name:"union",raw:"'none' | 'sm' | 'md' | 'lg' | 'full'",elements:[{name:"literal",value:"'none'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'full'"}]},description:`Border radius size\r
@default 'md'`,defaultValue:{value:"'md'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom CSS class",defaultValue:{value:"''",computed:!1}}},composes:["Omit"]};/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pa=D("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $a=D("MoreVertical",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ra=D("Share2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]]),Wa={component:a,title:"Components/Card",tags:["autodocs"],argTypes:{variant:{control:"select",options:["elevated","outlined","filled"],description:"Card visual variant"},size:{control:"select",options:["sm","md","lg"],description:"Card padding size"},rounded:{control:"select",options:["none","sm","md","lg","full"],description:"Border radius"},clickable:{control:"boolean",description:"Make card clickable"},hoverable:{control:"boolean",description:"Show hover effect"},disabled:{control:"boolean",description:"Disabled state"},loading:{control:"boolean",description:"Loading state"}}},n={args:{children:"This is a basic card with content."}},y={args:{header:e.jsx("h3",{className:"text-lg font-semibold",children:"Card Title"}),children:"Card description and content goes here."}},N={args:{header:e.jsx("h3",{className:"text-lg font-semibold",children:"Card Title"}),children:"Card content and description.",footer:e.jsx(B,{size:"sm",children:"Action"})}},C={args:{image:{src:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=200&fit=crop",alt:"Beautiful landscape",height:200},header:e.jsx("h3",{className:"text-lg font-semibold",children:"Card with Image"}),children:"This card features a banner image at the top.",footer:e.jsx("div",{className:"flex gap-2",children:e.jsx(B,{size:"sm",children:"Learn More"})})}},i={args:{variant:"elevated",header:e.jsx("h3",{className:"text-lg font-semibold",children:"Elevated Card"}),children:"This card has a shadow elevation effect."}},j={args:{variant:"outlined",header:e.jsx("h3",{className:"text-lg font-semibold",children:"Outlined Card"}),children:"This card has a border outline."}},w={args:{variant:"filled",header:e.jsx("h3",{className:"text-lg font-semibold",children:"Filled Card"}),children:"This card has a filled background."}},l={args:{size:"sm",header:e.jsx("h3",{className:"text-sm font-semibold",children:"Small Card"}),children:"Compact card with small padding."}},S={args:{size:"md",header:e.jsx("h3",{className:"text-lg font-semibold",children:"Medium Card"}),children:"Default card size with standard padding."}},z={args:{size:"lg",header:e.jsx("h3",{className:"text-xl font-semibold",children:"Large Card"}),children:"Large card with generous padding for prominent content."}},o={args:{rounded:"none",header:e.jsx("h3",{className:"font-semibold",children:"Square Card"}),children:"Card with no rounding."}},k={args:{rounded:"sm",header:e.jsx("h3",{className:"font-semibold",children:"Slightly Rounded"}),children:"Card with small rounding."}},T={args:{rounded:"lg",header:e.jsx("h3",{className:"font-semibold",children:"Highly Rounded"}),children:"Card with large rounding."}},c={args:{clickable:!0,header:e.jsx("h3",{className:"text-lg font-semibold",children:"Click Me"}),children:"This card is clickable. Try clicking it!"}},L={args:{disabled:!0,header:e.jsx("h3",{className:"text-lg font-semibold",children:"Disabled Card"}),children:"This card is disabled and not interactive."}},V={args:{loading:!0,header:e.jsx("h3",{className:"text-lg font-semibold",children:"Loading..."}),children:"Card content is loading."}},m={render:()=>e.jsx(a,{variant:"elevated",size:"md",image:{src:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",alt:"Laptop product",height:250},clickable:!0,onClick:()=>alert("Product clicked!"),children:e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Premium Laptop"}),e.jsx("p",{className:"text-ds-gray-600 mb-4",children:"High-performance laptop with latest technology. Perfect for professionals."}),e.jsxs("div",{className:"flex items-baseline justify-between",children:[e.jsx("span",{className:"text-2xl font-bold text-ds-primary",children:"$1,299"}),e.jsx("span",{className:"text-sm text-ds-gray-500 line-through",children:"$1,599"})]})]})})},h={render:()=>e.jsx(a,{variant:"outlined",size:"md",className:"max-w-sm",children:e.jsxs("div",{className:"text-center",children:[e.jsx("img",{src:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",alt:"User avatar",className:"w-20 h-20 rounded-full mx-auto mb-4"}),e.jsx("h3",{className:"text-lg font-semibold mb-1",children:"Sarah Johnson"}),e.jsx("p",{className:"text-ds-gray-600 mb-4",children:"Product Designer"}),e.jsx("p",{className:"text-sm text-ds-gray-600 mb-6",children:"Creating beautiful and functional user experiences. Coffee enthusiast."}),e.jsxs("div",{className:"flex gap-2 justify-center",children:[e.jsx(B,{size:"sm",variant:"secondary",children:"Follow"}),e.jsx(B,{size:"sm",variant:"secondary",children:"Message"})]})]})})},p={render:()=>e.jsxs(a,{variant:"elevated",size:"md",header:e.jsx("div",{className:"mb-2",children:e.jsx("span",{className:"inline-block bg-blue-100 text-ds-primary text-xs font-semibold px-3 py-1 rounded-full",children:"Technology"})}),image:{src:"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop",alt:"Tech article",height:200},footer:e.jsxs("div",{className:"flex items-center justify-between text-sm text-ds-gray-600",children:[e.jsx("span",{children:"5 min read"}),e.jsx("span",{children:"Mar 15, 2024"})]}),children:[e.jsx("h3",{className:"text-xl font-bold mb-2",children:"The Future of Web Development"}),e.jsx("p",{className:"text-ds-gray-700",children:"Exploring the latest trends and technologies shaping the future of web development..."})]})},u={render:()=>e.jsxs(a,{variant:"filled",size:"md",className:"text-center",children:[e.jsx("div",{className:"mb-4",children:e.jsx("span",{className:"text-4xl font-bold text-ds-primary",children:"2.4K"})}),e.jsx("p",{className:"text-ds-gray-600",children:"Total Users"}),e.jsx("p",{className:"text-sm text-green-600 mt-2",children:"↑ 12% from last month"})]})},g={render:()=>e.jsxs(a,{variant:"elevated",size:"md",children:[e.jsxs("div",{className:"flex items-start justify-between mb-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Post Title"}),e.jsx("p",{className:"text-sm text-ds-gray-600",children:"by John Doe • 2 hours ago"})]}),e.jsx("button",{className:"text-ds-gray-400 hover:text-ds-gray-600",children:e.jsx($a,{size:20})})]}),e.jsx("p",{className:"text-ds-gray-700 mb-4",children:"This is an interesting post about web development and design patterns."}),e.jsxs("div",{className:"flex gap-4 pt-4 border-t border-ds-gray-200",children:[e.jsxs("button",{className:"flex items-center gap-2 text-ds-gray-600 hover:text-red-500 transition-colors",children:[e.jsx(Pa,{size:18}),e.jsx("span",{children:"124"})]}),e.jsxs("button",{className:"flex items-center gap-2 text-ds-gray-600 hover:text-ds-primary transition-colors",children:[e.jsx(Ra,{size:18}),e.jsx("span",{children:"Share"})]})]})]})},x={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsxs(a,{variant:"elevated",children:[e.jsx("h3",{className:"font-semibold mb-2",children:"Elevated"}),e.jsx("p",{className:"text-sm text-ds-gray-600",children:"Shadow effect card"})]}),e.jsxs(a,{variant:"outlined",children:[e.jsx("h3",{className:"font-semibold mb-2",children:"Outlined"}),e.jsx("p",{className:"text-sm text-ds-gray-600",children:"Border outline card"})]}),e.jsxs(a,{variant:"filled",children:[e.jsx("h3",{className:"font-semibold mb-2",children:"Filled"}),e.jsx("p",{className:"text-sm text-ds-gray-600",children:"Filled background card"})]})]})},f={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs(a,{size:"sm",children:[e.jsx("h3",{className:"font-semibold",children:"Small Card"}),e.jsx("p",{className:"text-sm",children:"Compact padding"})]}),e.jsxs(a,{size:"md",children:[e.jsx("h3",{className:"font-semibold",children:"Medium Card"}),e.jsx("p",{className:"text-sm",children:"Default padding"})]}),e.jsxs(a,{size:"lg",children:[e.jsx("h3",{className:"font-semibold",children:"Large Card"}),e.jsx("p",{className:"text-sm",children:"Generous padding"})]})]})};var F,E,O,H,I;n.parameters={...n.parameters,docs:{...(F=n.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    children: 'This is a basic card with content.'
  }
}`,...(O=(E=n.parameters)==null?void 0:E.docs)==null?void 0:O.source},description:{story:"Basic Card Stories",...(I=(H=n.parameters)==null?void 0:H.docs)==null?void 0:I.description}}};var W,U,K;y.parameters={...y.parameters,docs:{...(W=y.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    header: <h3 className="text-lg font-semibold">Card Title</h3>,
    children: 'Card description and content goes here.'
  }
}`,...(K=(U=y.parameters)==null?void 0:U.docs)==null?void 0:K.source}}};var J,_,G;N.parameters={...N.parameters,docs:{...(J=N.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    header: <h3 className="text-lg font-semibold">Card Title</h3>,
    children: 'Card content and description.',
    footer: <Button size="sm">Action</Button>
  }
}`,...(G=(_=N.parameters)==null?void 0:_.docs)==null?void 0:G.source}}};var Z,Q,X;C.parameters={...C.parameters,docs:{...(Z=C.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    image: {
      src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=200&fit=crop',
      alt: 'Beautiful landscape',
      height: 200
    },
    header: <h3 className="text-lg font-semibold">Card with Image</h3>,
    children: 'This card features a banner image at the top.',
    footer: <div className="flex gap-2"><Button size="sm">Learn More</Button></div>
  }
}`,...(X=(Q=C.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,ee,ae,re,se;i.parameters={...i.parameters,docs:{...(Y=i.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    variant: 'elevated',
    header: <h3 className="text-lg font-semibold">Elevated Card</h3>,
    children: 'This card has a shadow elevation effect.'
  }
}`,...(ae=(ee=i.parameters)==null?void 0:ee.docs)==null?void 0:ae.source},description:{story:"Variant Stories",...(se=(re=i.parameters)==null?void 0:re.docs)==null?void 0:se.description}}};var te,de,ne;j.parameters={...j.parameters,docs:{...(te=j.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    variant: 'outlined',
    header: <h3 className="text-lg font-semibold">Outlined Card</h3>,
    children: 'This card has a border outline.'
  }
}`,...(ne=(de=j.parameters)==null?void 0:de.docs)==null?void 0:ne.source}}};var ie,le,oe;w.parameters={...w.parameters,docs:{...(ie=w.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    variant: 'filled',
    header: <h3 className="text-lg font-semibold">Filled Card</h3>,
    children: 'This card has a filled background.'
  }
}`,...(oe=(le=w.parameters)==null?void 0:le.docs)==null?void 0:oe.source}}};var ce,me,he,pe,ue;l.parameters={...l.parameters,docs:{...(ce=l.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    size: 'sm',
    header: <h3 className="text-sm font-semibold">Small Card</h3>,
    children: 'Compact card with small padding.'
  }
}`,...(he=(me=l.parameters)==null?void 0:me.docs)==null?void 0:he.source},description:{story:"Size Stories",...(ue=(pe=l.parameters)==null?void 0:pe.docs)==null?void 0:ue.description}}};var ge,xe,fe;S.parameters={...S.parameters,docs:{...(ge=S.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  args: {
    size: 'md',
    header: <h3 className="text-lg font-semibold">Medium Card</h3>,
    children: 'Default card size with standard padding.'
  }
}`,...(fe=(xe=S.parameters)==null?void 0:xe.docs)==null?void 0:fe.source}}};var be,ve,ye;z.parameters={...z.parameters,docs:{...(be=z.parameters)==null?void 0:be.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    header: <h3 className="text-xl font-semibold">Large Card</h3>,
    children: 'Large card with generous padding for prominent content.'
  }
}`,...(ye=(ve=z.parameters)==null?void 0:ve.docs)==null?void 0:ye.source}}};var Ne,Ce,je,we,Se;o.parameters={...o.parameters,docs:{...(Ne=o.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  args: {
    rounded: 'none',
    header: <h3 className="font-semibold">Square Card</h3>,
    children: 'Card with no rounding.'
  }
}`,...(je=(Ce=o.parameters)==null?void 0:Ce.docs)==null?void 0:je.source},description:{story:"Rounded Stories",...(Se=(we=o.parameters)==null?void 0:we.docs)==null?void 0:Se.description}}};var ze,ke,Te;k.parameters={...k.parameters,docs:{...(ze=k.parameters)==null?void 0:ze.docs,source:{originalSource:`{
  args: {
    rounded: 'sm',
    header: <h3 className="font-semibold">Slightly Rounded</h3>,
    children: 'Card with small rounding.'
  }
}`,...(Te=(ke=k.parameters)==null?void 0:ke.docs)==null?void 0:Te.source}}};var Le,Ve,Be;T.parameters={...T.parameters,docs:{...(Le=T.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  args: {
    rounded: 'lg',
    header: <h3 className="font-semibold">Highly Rounded</h3>,
    children: 'Card with large rounding.'
  }
}`,...(Be=(Ve=T.parameters)==null?void 0:Ve.docs)==null?void 0:Be.source}}};var qe,Ae,Me,De,Pe;c.parameters={...c.parameters,docs:{...(qe=c.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  args: {
    clickable: true,
    header: <h3 className="text-lg font-semibold">Click Me</h3>,
    children: 'This card is clickable. Try clicking it!'
  }
}`,...(Me=(Ae=c.parameters)==null?void 0:Ae.docs)==null?void 0:Me.source},description:{story:"Interactive Stories",...(Pe=(De=c.parameters)==null?void 0:De.docs)==null?void 0:Pe.description}}};var $e,Re,Fe;L.parameters={...L.parameters,docs:{...($e=L.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  args: {
    disabled: true,
    header: <h3 className="text-lg font-semibold">Disabled Card</h3>,
    children: 'This card is disabled and not interactive.'
  }
}`,...(Fe=(Re=L.parameters)==null?void 0:Re.docs)==null?void 0:Fe.source}}};var Ee,Oe,He;V.parameters={...V.parameters,docs:{...(Ee=V.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  args: {
    loading: true,
    header: <h3 className="text-lg font-semibold">Loading...</h3>,
    children: 'Card content is loading.'
  }
}`,...(He=(Oe=V.parameters)==null?void 0:Oe.docs)==null?void 0:He.source}}};var Ie,We,Ue,Ke,Je;m.parameters={...m.parameters,docs:{...(Ie=m.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  render: () => <Card variant="elevated" size="md" image={{
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    alt: 'Laptop product',
    height: 250
  }} clickable onClick={() => alert('Product clicked!')}>\r
      <div>\r
        <h3 className="text-lg font-semibold mb-2">Premium Laptop</h3>\r
        <p className="text-ds-gray-600 mb-4">\r
          High-performance laptop with latest technology. Perfect for professionals.\r
        </p>\r
        <div className="flex items-baseline justify-between">\r
          <span className="text-2xl font-bold text-ds-primary">$1,299</span>\r
          <span className="text-sm text-ds-gray-500 line-through">$1,599</span>\r
        </div>\r
      </div>\r
    </Card>
}`,...(Ue=(We=m.parameters)==null?void 0:We.docs)==null?void 0:Ue.source},description:{story:"Product Card Example",...(Je=(Ke=m.parameters)==null?void 0:Ke.docs)==null?void 0:Je.description}}};var _e,Ge,Ze,Qe,Xe;h.parameters={...h.parameters,docs:{...(_e=h.parameters)==null?void 0:_e.docs,source:{originalSource:`{
  render: () => <Card variant="outlined" size="md" className="max-w-sm">\r
      <div className="text-center">\r
        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" alt="User avatar" className="w-20 h-20 rounded-full mx-auto mb-4" />\r
        <h3 className="text-lg font-semibold mb-1">Sarah Johnson</h3>\r
        <p className="text-ds-gray-600 mb-4">Product Designer</p>\r
        <p className="text-sm text-ds-gray-600 mb-6">\r
          Creating beautiful and functional user experiences. Coffee enthusiast.\r
        </p>\r
        <div className="flex gap-2 justify-center">\r
          <Button size="sm" variant="secondary">Follow</Button>\r
          <Button size="sm" variant="secondary">Message</Button>\r
        </div>\r
      </div>\r
    </Card>
}`,...(Ze=(Ge=h.parameters)==null?void 0:Ge.docs)==null?void 0:Ze.source},description:{story:"User Profile Card",...(Xe=(Qe=h.parameters)==null?void 0:Qe.docs)==null?void 0:Xe.description}}};var Ye,ea,aa,ra,sa;p.parameters={...p.parameters,docs:{...(Ye=p.parameters)==null?void 0:Ye.docs,source:{originalSource:`{
  render: () => <Card variant="elevated" size="md" header={<div className="mb-2">\r
          <span className="inline-block bg-blue-100 text-ds-primary text-xs font-semibold px-3 py-1 rounded-full">\r
            Technology\r
          </span>\r
        </div>} image={{
    src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
    alt: 'Tech article',
    height: 200
  }} footer={<div className="flex items-center justify-between text-sm text-ds-gray-600">\r
          <span>5 min read</span>\r
          <span>Mar 15, 2024</span>\r
        </div>}>\r
      <h3 className="text-xl font-bold mb-2">The Future of Web Development</h3>\r
      <p className="text-ds-gray-700">\r
        Exploring the latest trends and technologies shaping the future of web development...\r
      </p>\r
    </Card>
}`,...(aa=(ea=p.parameters)==null?void 0:ea.docs)==null?void 0:aa.source},description:{story:"Article Card",...(sa=(ra=p.parameters)==null?void 0:ra.docs)==null?void 0:sa.description}}};var ta,da,na,ia,la;u.parameters={...u.parameters,docs:{...(ta=u.parameters)==null?void 0:ta.docs,source:{originalSource:`{
  render: () => <Card variant="filled" size="md" className="text-center">\r
      <div className="mb-4">\r
        <span className="text-4xl font-bold text-ds-primary">2.4K</span>\r
      </div>\r
      <p className="text-ds-gray-600">Total Users</p>\r
      <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>\r
    </Card>
}`,...(na=(da=u.parameters)==null?void 0:da.docs)==null?void 0:na.source},description:{story:"Stats Card",...(la=(ia=u.parameters)==null?void 0:ia.docs)==null?void 0:la.description}}};var oa,ca,ma,ha,pa;g.parameters={...g.parameters,docs:{...(oa=g.parameters)==null?void 0:oa.docs,source:{originalSource:`{
  render: () => <Card variant="elevated" size="md">\r
      <div className="flex items-start justify-between mb-4">\r
        <div>\r
          <h3 className="text-lg font-semibold">Post Title</h3>\r
          <p className="text-sm text-ds-gray-600">by John Doe • 2 hours ago</p>\r
        </div>\r
        <button className="text-ds-gray-400 hover:text-ds-gray-600">\r
          <MoreVertical size={20} />\r
        </button>\r
      </div>\r
      <p className="text-ds-gray-700 mb-4">\r
        This is an interesting post about web development and design patterns.\r
      </p>\r
      <div className="flex gap-4 pt-4 border-t border-ds-gray-200">\r
        <button className="flex items-center gap-2 text-ds-gray-600 hover:text-red-500 transition-colors">\r
          <Heart size={18} />\r
          <span>124</span>\r
        </button>\r
        <button className="flex items-center gap-2 text-ds-gray-600 hover:text-ds-primary transition-colors">\r
          <Share2 size={18} />\r
          <span>Share</span>\r
        </button>\r
      </div>\r
    </Card>
}`,...(ma=(ca=g.parameters)==null?void 0:ca.docs)==null?void 0:ma.source},description:{story:"Interactive Actions Card",...(pa=(ha=g.parameters)==null?void 0:ha.docs)==null?void 0:pa.description}}};var ua,ga,xa,fa,ba;x.parameters={...x.parameters,docs:{...(ua=x.parameters)==null?void 0:ua.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-3 gap-4">\r
      <Card variant="elevated">\r
        <h3 className="font-semibold mb-2">Elevated</h3>\r
        <p className="text-sm text-ds-gray-600">Shadow effect card</p>\r
      </Card>\r
      <Card variant="outlined">\r
        <h3 className="font-semibold mb-2">Outlined</h3>\r
        <p className="text-sm text-ds-gray-600">Border outline card</p>\r
      </Card>\r
      <Card variant="filled">\r
        <h3 className="font-semibold mb-2">Filled</h3>\r
        <p className="text-sm text-ds-gray-600">Filled background card</p>\r
      </Card>\r
    </div>
}`,...(xa=(ga=x.parameters)==null?void 0:ga.docs)==null?void 0:xa.source},description:{story:"All Variants Showcase",...(ba=(fa=x.parameters)==null?void 0:fa.docs)==null?void 0:ba.description}}};var va,ya,Na,Ca,ja;f.parameters={...f.parameters,docs:{...(va=f.parameters)==null?void 0:va.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">\r
      <Card size="sm">\r
        <h3 className="font-semibold">Small Card</h3>\r
        <p className="text-sm">Compact padding</p>\r
      </Card>\r
      <Card size="md">\r
        <h3 className="font-semibold">Medium Card</h3>\r
        <p className="text-sm">Default padding</p>\r
      </Card>\r
      <Card size="lg">\r
        <h3 className="font-semibold">Large Card</h3>\r
        <p className="text-sm">Generous padding</p>\r
      </Card>\r
    </div>
}`,...(Na=(ya=f.parameters)==null?void 0:ya.docs)==null?void 0:Na.source},description:{story:"All Sizes Showcase",...(ja=(Ca=f.parameters)==null?void 0:Ca.docs)==null?void 0:ja.description}}};const Ua=["Basic","WithHeader","WithFooter","WithImage","ElevatedVariant","OutlinedVariant","FilledVariant","SmallSize","MediumSize","LargeSize","RoundedNone","RoundedSmall","RoundedLarge","Clickable","Disabled","Loading","ProductCard","UserProfileCard","ArticleCard","StatsCard","ActionsCard","AllVariants","AllSizes"];export{g as ActionsCard,f as AllSizes,x as AllVariants,p as ArticleCard,n as Basic,c as Clickable,L as Disabled,i as ElevatedVariant,w as FilledVariant,z as LargeSize,V as Loading,S as MediumSize,j as OutlinedVariant,m as ProductCard,T as RoundedLarge,o as RoundedNone,k as RoundedSmall,l as SmallSize,u as StatsCard,h as UserProfileCard,N as WithFooter,y as WithHeader,C as WithImage,Ua as __namedExportsOrder,Wa as default};
