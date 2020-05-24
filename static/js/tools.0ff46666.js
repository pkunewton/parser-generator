(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{72:function(t,e,s){var o=s(1),a=s(89);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[t.i,a,""]]);var l={insert:"head",singleton:!1},r=(o(a,l),a.locals?a.locals:{});t.exports=r},88:function(t,e,s){"use strict";var o=s(72);s.n(o).a},89:function(t,e,s){},94:function(t,e,s){"use strict";s.r(e);var o=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}]},[s("el-input",{attrs:{type:"textarea",placeholder:"请输入内容",maxlength:"9999",size:"medium",rows:"20","show-word-limit":""},model:{value:t.grammar,callback:function(e){t.grammar=e},expression:"grammar"}}),t._v(" "),s("el-alert",{directives:[{name:"show",rawName:"v-show",value:""!=t.errorMsg,expression:"errorMsg!=''"}],attrs:{title:t.errorMsg,type:"error","show-icon":"",closable:!1}}),t._v(" "),s("el-alert",{directives:[{name:"show",rawName:"v-show",value:""!=t.successMsg,expression:"successMsg!=''"}],attrs:{title:t.successMsg,type:"success","show-icon":"",closable:!1}}),t._v(" "),s("el-row",{attrs:{type:"flex"}},[s("el-select",{attrs:{placeholder:"parser type"},model:{value:t.options.parser,callback:function(e){t.$set(t.options,"parser",e)},expression:"options.parser"}},[s("el-option",{attrs:{label:"LL",value:"LL"}}),t._v(" "),s("el-option",{attrs:{label:"SLR",value:"SLR"}}),t._v(" "),s("el-option",{attrs:{label:"LR1",value:"LR1"}}),t._v(" "),s("el-option",{attrs:{label:"LALR",disabled:"",value:"LALR"}})],1),t._v(" "),s("el-select",{attrs:{placeholder:"lanuguage"},model:{value:t.options.lang,callback:function(e){t.$set(t.options,"lang",e)},expression:"options.lang"}},[s("el-option",{attrs:{label:"TS",value:"TS"}}),t._v(" "),s("el-option",{attrs:{label:"JS",disabled:"",value:"JS"}})],1)],1),t._v(" "),s("el-row",{attrs:{type:"flex",justify:"space-around"}},[s("el-button",{staticStyle:{width:"250px"},attrs:{type:"primary"},on:{click:t.gen}},[t._v("GO")])],1),t._v(" "),t.outputVisible?[s("h1",[t._v("Productions")]),t._v(" "),s("table",[t._m(0),t._v(" "),t._l(t.output.productions,(function(e,o){return s("tr",{key:o},[s("td",[t._v(t._s(e.id))]),t._v(" "),s("td",[t._v(t._s(e.head+"->"+e.body.join(" ")))]),t._v(" "),s("td",[t._v(t._s(e.action))])])}))],2),t._v(" "),s("collapse",[s("template",{slot:"head"},[t._v("First Set")]),t._v(" "),s("matrix-table",{attrs:{slot:"body",data:t.output.firstTable},slot:"body"})],2),t._v(" "),s("collapse",[s("template",{slot:"head"},[t._v("Follow Set")]),t._v(" "),s("matrix-table",{attrs:{slot:"body",data:t.output.followTable},slot:"body"})],2),t._v(" "),t.isLR?[s("collapse",[s("template",{slot:"head"},[t._v("LR Automata")]),t._v(" "),s("div",{staticStyle:{width:"calc(100% - 2px)",height:"600px",overflow:"auto",border:"1px solid #e1e4e8",resize:"vertical"},attrs:{slot:"body"},slot:"body"},[s("network",{ref:"automata",staticStyle:{height:"900px","background-color":"white",width:"calc(100% - 20px)"},attrs:{value:t.output.lrAutomata}})],1)],2),t._v(" "),s("collapse",[s("template",{slot:"head"},[t._v("LR Parsing Table")]),t._v(" "),s("matrix-table",{attrs:{slot:"body",data:t.output.lrTable},slot:"body"})],2)]:t._e(),t._v(" "),s("collapse",[s("template",{slot:"head"},[t._v("Parser Source Code")]),t._v(" "),s("template",{slot:"body"},[s("a",{attrs:{href:"javascript:void(0)"},on:{click:t.downloadSourceCode}},[t._v("download")]),t._v(" "),s("markdown",{attrs:{content:t.mdContent}})],1)],2)]:t._e()],2)};o._withStripped=!0;var a=s(77),l=s(0);const r={code:"",productions:[],firstTable:[],followTable:[],lrTable:[],lrAutomata:{nodes:[],edges:[]}};var i=l.default.extend({name:"MAIN",data:()=>({grammar:"<% import { Expr } from \"./ast\"; %>\n#TOKEN_PROTOTYPES\ndigit\n\n#GRAMMAR\nS->E;\nE->E '+' E | E '-' E |E'*'E |E'/'E | '(' E ')' | digit  <% (e)=>new Expr(e)  %>;\n\n#SYMBOL_ASSOC_PREC\nE left\n'+' 0\n'-' 0\n'*' 1\n'/' 1",output:r,options:{parser:"LR1",lang:"TS"},errorMsg0:"",successMsg0:"",loading:!1}),computed:{mdContent(){return"```ts\n"+this.output.code+"\n```"},isLR(){return"LL"!=this.options.parser&&this.outputVisible},outputVisible(){return""!=this.output.code},successMsg:{get(){return this.successMsg0},set(t){this.errorMsg0="",this.successMsg0=t}},errorMsg:{get(){return this.errorMsg0},set(t){this.successMsg0="",this.errorMsg0=t}}},methods:{async gen(){let t=new((await s.e(8).then(s.t.bind(null,91,7))).default);console.log("!!!",t);const e=this;t.onmessage=function(t){t.data.hasError?(e.errorMsg=t.data.error.message,e.output=r):(console.log("!!!",t.data.result),e.output=t.data.result,e.successMsg="success!"),Promise.resolve().then(()=>{e.loading=!1})},this.loading=!0,t.postMessage({grammar:this.grammar,options:this.options})},downloadSourceCode(){let t=new Blob([this.output.code],{type:"text/plain;charset=utf-8"});Object(a.saveAs)(t,"parser.ts")}}}),n=(s(88),s(2)),u=Object(n.a)(i,o,[function(){var t=this.$createElement,e=this._self._c||t;return e("tr",[e("td",[this._v("id")]),this._v(" "),e("td",[this._v("body")]),this._v(" "),e("td",[this._v("action")])])}],!1,null,null,null);u.options.__file="src/views/tools/index.vue";e.default=u.exports}}]);