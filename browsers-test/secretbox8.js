var Module=typeof Module!=="undefined"?Module:{};try{this["Module"]=Module;Module.test}catch(e){this["Module"]=Module={}}if(typeof process==="object"){if(typeof FS==="object"){Module["preRun"]=Module["preRun"]||[];Module["preRun"].push((function(){FS.init();FS.mkdir("/test-data");FS.mount(NODEFS,{root:"."},"/test-data")}))}}else{Module["print"]=(function(x){var event=new Event("test-output");event.data=x;window.dispatchEvent(event)})}var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key]}}Module["arguments"]=[];Module["thisProgram"]="./this.program";Module["quit"]=(function(status,toThrow){throw toThrow});Module["preRun"]=[];Module["postRun"]=[];var ENVIRONMENT_IS_WEB=false;var ENVIRONMENT_IS_WORKER=false;var ENVIRONMENT_IS_NODE=false;var ENVIRONMENT_IS_SHELL=false;ENVIRONMENT_IS_WEB=typeof window==="object";ENVIRONMENT_IS_WORKER=typeof importScripts==="function";ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof require==="function"&&!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER;ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}else{return scriptDirectory+path}}if(ENVIRONMENT_IS_NODE){scriptDirectory=__dirname+"/";var nodeFS;var nodePath;Module["read"]=function shell_read(filename,binary){var ret;ret=tryParseAsDataURI(filename);if(!ret){if(!nodeFS)nodeFS=require("fs");if(!nodePath)nodePath=require("path");filename=nodePath["normalize"](filename);ret=nodeFS["readFileSync"](filename)}return binary?ret:ret.toString()};Module["readBinary"]=function readBinary(filename){var ret=Module["read"](filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}assert(ret.buffer);return ret};if(process["argv"].length>1){Module["thisProgram"]=process["argv"][1].replace(/\\/g,"/")}Module["arguments"]=process["argv"].slice(2);if(typeof module!=="undefined"){module["exports"]=Module}process["on"]("uncaughtException",(function(ex){if(!(ex instanceof ExitStatus)){throw ex}}));process["on"]("unhandledRejection",(function(reason,p){process["exit"](1)}));Module["quit"]=(function(status){process["exit"](status)});Module["inspect"]=(function(){return"[Emscripten Module object]"})}else if(ENVIRONMENT_IS_SHELL){if(typeof read!="undefined"){Module["read"]=function shell_read(f){var data=tryParseAsDataURI(f);if(data){return intArrayToString(data)}return read(f)}}Module["readBinary"]=function readBinary(f){var data;data=tryParseAsDataURI(f);if(data){return data}if(typeof readbuffer==="function"){return new Uint8Array(readbuffer(f))}data=read(f,"binary");assert(typeof data==="object");return data};if(typeof scriptArgs!="undefined"){Module["arguments"]=scriptArgs}else if(typeof arguments!="undefined"){Module["arguments"]=arguments}if(typeof quit==="function"){Module["quit"]=(function(status){quit(status)})}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WEB){if(document.currentScript){scriptDirectory=document.currentScript.src}}else{scriptDirectory=self.location.href}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.lastIndexOf("/")+1)}else{scriptDirectory=""}Module["read"]=function shell_read(url){try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText}catch(err){var data=tryParseAsDataURI(url);if(data){return intArrayToString(data)}throw err}};if(ENVIRONMENT_IS_WORKER){Module["readBinary"]=function readBinary(url){try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}catch(err){var data=tryParseAsDataURI(url);if(data){return data}throw err}}}Module["readAsync"]=function readAsync(url,onload,onerror){var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=function xhr_onload(){if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}var data=tryParseAsDataURI(url);if(data){onload(data.buffer);return}onerror()};xhr.onerror=onerror;xhr.send(null)};Module["setWindowTitle"]=(function(title){document.title=title})}else{}var out=Module["print"]||(typeof console!=="undefined"?console.log.bind(console):typeof print!=="undefined"?print:null);var err=Module["printErr"]||(typeof printErr!=="undefined"?printErr:typeof console!=="undefined"&&console.warn.bind(console)||out);for(key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key]}}moduleOverrides=undefined;var STACK_ALIGN=16;function staticAlloc(size){var ret=STATICTOP;STATICTOP=STATICTOP+size+15&-16;return ret}function alignMemory(size,factor){if(!factor)factor=STACK_ALIGN;var ret=size=Math.ceil(size/factor)*factor;return ret}var asm2wasmImports={"f64-rem":(function(x,y){return x%y}),"debugger":(function(){debugger})};var functionPointers=new Array(8);var GLOBAL_BASE=1024;var ABORT=false;var EXITSTATUS=0;function assert(condition,text){if(!condition){abort("Assertion failed: "+text)}}function Pointer_stringify(ptr,length){if(length===0||!ptr)return"";var hasUtf=0;var t;var i=0;while(1){t=HEAPU8[ptr+i>>0];hasUtf|=t;if(t==0&&!length)break;i++;if(length&&i==length)break}if(!length)length=i;var ret="";if(hasUtf<128){var MAX_CHUNK=1024;var curr;while(length>0){curr=String.fromCharCode.apply(String,HEAPU8.subarray(ptr,ptr+Math.min(length,MAX_CHUNK)));ret=ret?ret+curr:curr;ptr+=MAX_CHUNK;length-=MAX_CHUNK}return ret}return UTF8ToString(ptr)}var UTF8Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(u8Array,idx){var endPtr=idx;while(u8Array[endPtr])++endPtr;if(endPtr-idx>16&&u8Array.subarray&&UTF8Decoder){return UTF8Decoder.decode(u8Array.subarray(idx,endPtr))}else{var u0,u1,u2,u3,u4,u5;var str="";while(1){u0=u8Array[idx++];if(!u0)return str;if(!(u0&128)){str+=String.fromCharCode(u0);continue}u1=u8Array[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}u2=u8Array[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u3=u8Array[idx++]&63;if((u0&248)==240){u0=(u0&7)<<18|u1<<12|u2<<6|u3}else{u4=u8Array[idx++]&63;if((u0&252)==248){u0=(u0&3)<<24|u1<<18|u2<<12|u3<<6|u4}else{u5=u8Array[idx++]&63;u0=(u0&1)<<30|u1<<24|u2<<18|u3<<12|u4<<6|u5}}}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}}}function UTF8ToString(ptr){return UTF8ArrayToString(HEAPU8,ptr)}function stringToUTF8Array(str,outU8Array,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;outU8Array[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;outU8Array[outIdx++]=192|u>>6;outU8Array[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;outU8Array[outIdx++]=224|u>>12;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else if(u<=2097151){if(outIdx+3>=endIdx)break;outU8Array[outIdx++]=240|u>>18;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else if(u<=67108863){if(outIdx+4>=endIdx)break;outU8Array[outIdx++]=248|u>>24;outU8Array[outIdx++]=128|u>>18&63;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else{if(outIdx+5>=endIdx)break;outU8Array[outIdx++]=252|u>>30;outU8Array[outIdx++]=128|u>>24&63;outU8Array[outIdx++]=128|u>>18&63;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}}outU8Array[outIdx]=0;return outIdx-startIdx}function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127){++len}else if(u<=2047){len+=2}else if(u<=65535){len+=3}else if(u<=2097151){len+=4}else if(u<=67108863){len+=5}else{len+=6}}return len}var UTF16Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf-16le"):undefined;function allocateUTF8OnStack(str){var size=lengthBytesUTF8(str)+1;var ret=stackAlloc(size);stringToUTF8Array(str,HEAP8,ret,size);return ret}var PAGE_SIZE=16384;var WASM_PAGE_SIZE=65536;var ASMJS_PAGE_SIZE=16777216;function alignUp(x,multiple){if(x%multiple>0){x+=multiple-x%multiple}return x}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBuffer(buf){Module["buffer"]=buffer=buf}function updateGlobalBufferViews(){Module["HEAP8"]=HEAP8=new Int8Array(buffer);Module["HEAP16"]=HEAP16=new Int16Array(buffer);Module["HEAP32"]=HEAP32=new Int32Array(buffer);Module["HEAPU8"]=HEAPU8=new Uint8Array(buffer);Module["HEAPU16"]=HEAPU16=new Uint16Array(buffer);Module["HEAPU32"]=HEAPU32=new Uint32Array(buffer);Module["HEAPF32"]=HEAPF32=new Float32Array(buffer);Module["HEAPF64"]=HEAPF64=new Float64Array(buffer)}var STATIC_BASE,STATICTOP,staticSealed;var STACK_BASE,STACKTOP,STACK_MAX;var DYNAMIC_BASE,DYNAMICTOP_PTR;STATIC_BASE=STATICTOP=STACK_BASE=STACKTOP=STACK_MAX=DYNAMIC_BASE=DYNAMICTOP_PTR=0;staticSealed=false;var TOTAL_STACK=Module["TOTAL_STACK"]||5242880;var TOTAL_MEMORY=Module["TOTAL_MEMORY"]||167772160;if(TOTAL_MEMORY<TOTAL_STACK)err("TOTAL_MEMORY should be larger than TOTAL_STACK, was "+TOTAL_MEMORY+"! (TOTAL_STACK="+TOTAL_STACK+")");if(Module["buffer"]){buffer=Module["buffer"]}else{if(typeof WebAssembly==="object"&&typeof WebAssembly.Memory==="function"){Module["wasmMemory"]=new WebAssembly.Memory({"initial":TOTAL_MEMORY/WASM_PAGE_SIZE,"maximum":TOTAL_MEMORY/WASM_PAGE_SIZE});buffer=Module["wasmMemory"].buffer}else{buffer=new ArrayBuffer(TOTAL_MEMORY)}Module["buffer"]=buffer}updateGlobalBufferViews();function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback();continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){Module["dynCall_v"](func)}else{Module["dynCall_vi"](func,callback.arg)}}else{func(callback.arg===undefined?null:callback.arg)}}}var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATEXIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;var runtimeExited=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function ensureInitRuntime(){if(runtimeInitialized)return;runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function preMain(){callRuntimeCallbacks(__ATMAIN__)}function exitRuntime(){callRuntimeCallbacks(__ATEXIT__);runtimeExited=true}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}Module["preloadedImages"]={};Module["preloadedAudios"]={};var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return String.prototype.startsWith?filename.startsWith(dataURIPrefix):filename.indexOf(dataURIPrefix)===0}function integrateWasmJS(){var wasmTextFile="";var wasmBinaryFile="data:application/octet-stream;base64,AGFzbQEAAAABXA5gA39/fwF/YAF/AX9gAX8AYAABf2ACf38Bf2AEf39/fwF/YAAAYAJ/fwBgBX9/fn9/AX9gBH9+f38Bf2AGf39+f35/AX9gBH9/fn8Bf2ADf39+AGAFf39/f38AApMCDwNlbnYGbWVtb3J5AgGAFIAUA2VudgV0YWJsZQFwACADZW52CXRhYmxlQmFzZQN/AANlbnYIU1RBQ0tUT1ADfwADZW52BWFib3J0AAIDZW52CWpzQ2FsbF9paQAEA2Vudgtqc0NhbGxfaWlpaQAFA2Vudg1fX19zeXNjYWxsMTQwAAQDZW52DV9fX3N5c2NhbGwxNDYABANlbnYMX19fc3lzY2FsbDU0AAQDZW52C19fX3N5c2NhbGw2AAQDZW52Bl9hYm9ydAAGA2VudhdfZW1zY3JpcHRlbl9hc21fY29uc3RfaQABA2VudhZfZW1zY3JpcHRlbl9tZW1jcHlfYmlnAAADZW52CF9zeXNjb25mAAEDPj0EBwEHAAEFBwwBAwEACwUCCAgDAAMAAAAAAAAAAQEBAQEBAQEAAAQFAQAAAwABDQoJAAcMBwsDAwMKCQgBBgYBfwEjAQsHKgMRX19fZXJybm9fbG9jYXRpb24ANgVfbWFpbgAfCnN0YWNrQWxsb2MARwkmAQAjAAsgDS4tLCsqKSgnOA0NDQ0NDQ8mJSQjIiEgHjU3Fw8PDw8KhTs9EAAgAEEgIAFrdiAAIAF0cgsJACAAIAE2AAALCABBABAAQQALQQECfyMCIQIjAkEQaiQCIAIiAyAANgIAIAEEQEEAIQADQCADKAIAIABqQQA6AAAgAEEBaiIAIAFHDQALCyACJAILCABBARAAQQALHAAgAEGAYEsEf0GghgJBACAAazYCAEF/BSAACwsQACAAIAEgAiADQRQQOUEACyQBAX8gAQRAA0AgACACakEAEAg6AAAgAkEBaiICIAFHDQALCwvyBAIPfxF+QQBBgICACCAALABQGyEMIAAoAgQhCCAAKAIIIQkgACgCDCEKIAAoAhAhCyAAQRRqIg0oAgAhBCAAQRhqIg4oAgAhAyAAQRxqIg8oAgAhBSAAQSBqIhAoAgAhBiAAQSRqIhEoAgAhByACQg9WBEAgACgCAK0hEiALQQVsrSEUIApBBWytIRsgCUEFbK0hHSAIQQVsrSEgIAitIRUgCa0hHCAKrSEeIAutISEgAyEAIAEhAwNAIANBA2ooAABBAnZB////H3EgAGqtIhYgFH4gAygAAEH///8fcSAEaq0iFyASfnwgA0EGaigAAEEEdkH///8fcSAFaq0iGCAbfnwgA0EJaigAAEEGdiAGaq0iGSAdfnwgA0EMaigAAEEIdiAMciAHaq0iGiAgfnwhHyAWIBV+IBcgHH58IBggEn58IBkgFH58IBogG358IBYgEn4gFyAVfnwgGCAUfnwgGSAbfnwgGiAdfnwgH0IaiEL/////D4N8IiJCGohC/////w+DfCITp0H///8fcSEFIBYgHH4gFyAefnwgGCAVfnwgGSASfnwgGiAUfnwgE0IaiEL/////D4N8IhOnQf///x9xIQYgFiAefiAXICF+fCAYIBx+fCAZIBV+fCAaIBJ+fCATQhqIQv////8Pg3wiE6dB////H3EhByATQhqIp0EFbCAfp0H///8fcWoiAEH///8fcSEBIABBGnYgIqdB////H3FqIQAgA0EQaiEDIAJCcHwiAkIPVgRAIAEhBAwBCwsFIAQhASADIQALIA0gATYCACAOIAA2AgAgDyAFNgIAIBAgBjYCACARIAc2AgALcwECf0GACCgCACIBKAJMGgJ/IABBASAAEDMiACABEDIgAEdBH3RBH3VBAEgEf0F/BSABLABLQQpHBEAgAUEUaiICKAIAIgAgASgCEEkEQCACIABBAWo2AgAgAEEKOgAAQQAMAwsLIAFBChAxQR91CwsiAAspAQF+QaCCAkGgggIpAwBCrf7V5NSF/ajYAH5CAXwiADcDACAAQiGIpwtrAQJ/IABBygBqIgIsAAAhASACIAFB/wFqIAFyOgAAIAAoAgAiAUEIcQR/IAAgAUEgcjYCAEF/BSAAQQA2AgggAEEANgIEIAAgACgCLCIBNgIcIAAgATYCFCAAIAEgACgCMGo2AhBBAAsiAAuEAwEMfwJ/IwIhDiMCQT9qQUBxJAIjAiEDIwJBMGokAiADQSBqIQUgAyAAQRxqIgkoAgAiBDYCACADIABBFGoiCigCACAEayIENgIEIAMgATYCCCADIAI2AgwgA0EQaiIBIABBPGoiDCgCADYCACABIAM2AgQgAUECNgIIAkACQCAEIAJqIgRBkgEgARAEEBAiBkYNAEECIQcgAyEBIAYhAwNAIANBAE4EQCABQQhqIAEgAyABKAIEIghLIgYbIgEgASgCACADIAhBACAGG2siCGo2AgAgAUEEaiINIA0oAgAgCGs2AgAgBSAMKAIANgIAIAUgATYCBCAFIAcgBkEfdEEfdWoiBzYCCCAEIANrIgRBkgEgBRAEEBAiA0YNAgwBCwsgAEEANgIQIAlBADYCACAKQQA2AgAgACAAKAIAQSByNgIAIAdBAkYEf0EABSACIAEoAgRrCyECDAELIAAgACgCLCIBIAAoAjBqNgIQIAkgATYCACAKIAE2AgALIA4LJAIgAgs7AQN/An8jAiEGIwJBP2pBQHEkAiMCIQQjAkHgAGokAiAEIAMQPSAEIAEgAhA+IAQgABA/IAYLJAJBAAu0BQEQfyACKAAAIQkgAkEEaigAACEKIAJBCGooAAAhESACQQxqKAAAIQsgAkEQaigAACEMIAJBFGooAAAhBiACQRhqKAAAIQ0gAkEcaigAACEOIAEoAAAhBSABQQRqKAAAIQcgAUEIaigAACEIIAFBDGooAAAhD0EUIRIgAwR/IAMoAAAhECADQQRqKAAAIQQgA0EMaigAACETIANBCGooAAAFQfTKgdkGIRNB7siBmQMhBEHl8MGLBiEQQbLaiMsHCyIDIQEgBCECIBAhAyATIQQDQCAGIANqQQcQCyALcyILIANqQQkQCyAIcyIIIAtqQQ0QCyAGcyIQIAhqQRIQCyADcyEDIAIgCWpBBxALIA9zIgYgAmpBCRALIA1zIg0gBmpBDRALIAlzIgkgDWpBEhALIAJzIQIgASAFakEHEAsgDnMiDiABakEJEAsgCnMiCiAOakENEAsgBXMiDyAKakESEAsgAXMhASAEIAxqQQcQCyARcyIFIARqQQkQCyAHcyIHIAVqQQ0QCyAMcyIMIAdqQRIQCyAEcyEEIAUgA2pBBxALIAlzIgkgA2pBCRALIApzIgogCWpBDRALIAVzIhEgCmpBEhALIANzIQMgAiALakEHEAsgD3MiBSACakEJEAsgB3MiByAFakENEAsgC3MiCyAHakESEAsgAnMhAiABIAZqQQcQCyAMcyIMIAFqQQkQCyAIcyIIIAxqQQ0QCyAGcyIPIAhqQRIQCyABcyEBIAQgDmpBBxALIBBzIgYgBGpBCRALIA1zIg0gBmpBDRALIA5zIg4gDWpBEhALIARzIQQgEkF+aiISDQALIAAgAxAMIABBBGogAhAMIABBCGogARAMIABBDGogBBAMIABBEGogBRAMIABBFGogBxAMIABBGGogCBAMIABBHGogDxAMQQALEAAgAEIANwIAIABCADcCCAsQACAAIAEgAiADQgAgBBBECz4AIAJCIFQEf0F/BSAAIAEgAiADIAQQGxogAEEQaiAAQSBqIAJCYHwgABAYGiAAQgA3AAAgAEIANwAIQQALC8UBAgR/AX4CfwJAA0BBkA9BIBASQbAPQRgQEkHwDyACEBJB4N0AQdAPIAJBIGoiA60iBEGwD0GQDxAcGkEAIQEDQBAVQf8BcSEAEBUgA3BB4N0AaiAAOgAAQfCrAUHg3QAgBEGwD0GQDxBGBEAgAUEBaiEBBUEAIQADQCAAQfCrAWosAAAgAEHQD2osAABHDQQgAEEBaiIAIANJDQALCyABQQpIDQALIAJBAWoiAkHoB0kNAAtBAAwBC0GQCRAUGkHkAAsiAQsMAEEHIAAgASACEAILHAAQQwR/QeMABRAdBH9B4wAFQYAJEBQaQQALCwsMAEEGIAAgASACEAILDABBBSAAIAEgAhACCwwAQQQgACABIAIQAgsMAEEDIAAgASACEAILDABBAiAAIAEgAhACCwwAQQEgACABIAIQAgsMAEEAIAAgASACEAILCABBByAAEAELCABBBiAAEAELCABBBSAAEAELCABBBCAAEAELCABBAyAAEAELCABBAiAAEAELCABBASAAEAELCABBACAAEAELmAIBBH8gACACaiEEIAFB/wFxIQEgAkHDAE4EQANAIABBA3EEQCAAIAE6AAAgAEEBaiEADAELCyAEQXxxIgVBQGohBiABIAFBCHRyIAFBEHRyIAFBGHRyIQMDQCAAIAZMBEAgACADNgIAIAAgAzYCBCAAIAM2AgggACADNgIMIAAgAzYCECAAIAM2AhQgACADNgIYIAAgAzYCHCAAIAM2AiAgACADNgIkIAAgAzYCKCAAIAM2AiwgACADNgIwIAAgAzYCNCAAIAM2AjggACADNgI8IABBQGshAAwBCwsDQCAAIAVIBEAgACADNgIAIABBBGohAAwBCwsLA0AgACAESARAIAAgAToAACAAQQFqIQAMAQsLIAQgAmsLwwMBA38gAkGAwABOBEAgACABIAIQCQ8LIAAhBCAAIAJqIQMgAEEDcSABQQNx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AEGACAsFBAQAAAUAQZAICwEJAEGoCAsOCQAAAAoAAAAYfQAAAAQAQcAICwEBAEHPCAsFCv////8AQYAJC48GLS0tIFNVQ0NFU1MgLS0tAGZvcmdlcnkAInsgcmV0dXJuIE1vZHVsZS5nZXRSYW5kb21WYWx1ZSgpOyB9IgB7IGlmIChNb2R1bGUuZ2V0UmFuZG9tVmFsdWUgPT09IHVuZGVmaW5lZCkgeyB0cnkgeyB2YXIgd2luZG93XyA9ICdvYmplY3QnID09PSB0eXBlb2Ygd2luZG93ID8gd2luZG93IDogc2VsZjsgdmFyIGNyeXB0b18gPSB0eXBlb2Ygd2luZG93Xy5jcnlwdG8gIT09ICd1bmRlZmluZWQnID8gd2luZG93Xy5jcnlwdG8gOiB3aW5kb3dfLm1zQ3J5cHRvOyB2YXIgcmFuZG9tVmFsdWVzU3RhbmRhcmQgPSBmdW5jdGlvbigpIHsgdmFyIGJ1ZiA9IG5ldyBVaW50MzJBcnJheSgxKTsgY3J5cHRvXy5nZXRSYW5kb21WYWx1ZXMoYnVmKTsgcmV0dXJuIGJ1ZlswXSA+Pj4gMDsgfTsgcmFuZG9tVmFsdWVzU3RhbmRhcmQoKTsgTW9kdWxlLmdldFJhbmRvbVZhbHVlID0gcmFuZG9tVmFsdWVzU3RhbmRhcmQ7IH0gY2F0Y2ggKGUpIHsgdHJ5IHsgdmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpOyB2YXIgcmFuZG9tVmFsdWVOb2RlSlMgPSBmdW5jdGlvbigpIHsgdmFyIGJ1ZiA9IGNyeXB0b1sncmFuZG9tQnl0ZXMnXSg0KTsgcmV0dXJuIChidWZbMF0gPDwgMjQgfCBidWZbMV0gPDwgMTYgfCBidWZbMl0gPDwgOCB8IGJ1ZlszXSkgPj4+IDA7IH07IHJhbmRvbVZhbHVlTm9kZUpTKCk7IE1vZHVsZS5nZXRSYW5kb21WYWx1ZSA9IHJhbmRvbVZhbHVlTm9kZUpTOyB9IGNhdGNoIChlKSB7IHRocm93ICdObyBzZWN1cmUgcmFuZG9tIG51bWJlciBnZW5lcmF0b3IgZm91bmQnOyB9IH0gfSB9";var asmjsCodeFile="";if(!isDataURI(wasmTextFile)){wasmTextFile=locateFile(wasmTextFile)}if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}if(!isDataURI(asmjsCodeFile)){asmjsCodeFile=locateFile(asmjsCodeFile)}var wasmPageSize=64*1024;var info={"global":null,"env":null,"asm2wasm":asm2wasmImports,"parent":Module};var exports=null;function mergeMemory(newBuffer){var oldBuffer=Module["buffer"];if(newBuffer.byteLength<oldBuffer.byteLength){err("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here")}var oldView=new Int8Array(oldBuffer);var newView=new Int8Array(newBuffer);newView.set(oldView);updateGlobalBuffer(newBuffer);updateGlobalBufferViews()}function fixImports(imports){return imports}function getBinary(){try{if(Module["wasmBinary"]){return new Uint8Array(Module["wasmBinary"])}var binary=tryParseAsDataURI(wasmBinaryFile);if(binary){return binary}if(Module["readBinary"]){return Module["readBinary"](wasmBinaryFile)}else{throw"both async and sync fetching of the wasm failed"}}catch(err){abort(err)}}function getBinaryPromise(){if(!Module["wasmBinary"]&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then((function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()})).catch((function(){return getBinary()}))}return new Promise((function(resolve,reject){resolve(getBinary())}))}function doNativeWasm(global,env,providedBuffer){if(typeof WebAssembly!=="object"){err("no native wasm support detected");return false}if(!(Module["wasmMemory"]instanceof WebAssembly.Memory)){err("no native wasm Memory in use");return false}env["memory"]=Module["wasmMemory"];info["global"]={"NaN":NaN,"Infinity":Infinity};info["global.Math"]=Math;info["env"]=env;function receiveInstance(instance,module){exports=instance.exports;if(exports.memory)mergeMemory(exports.memory);Module["asm"]=exports;Module["usingWasm"]=true;removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");if(Module["instantiateWasm"]){try{return Module["instantiateWasm"](info,receiveInstance)}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}function receiveInstantiatedSource(output){receiveInstance(output["instance"],output["module"])}function instantiateArrayBuffer(receiver){getBinaryPromise().then((function(binary){return WebAssembly.instantiate(binary,info)})).then(receiver).catch((function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason)}))}if(!Module["wasmBinary"]&&typeof WebAssembly.instantiateStreaming==="function"&&!isDataURI(wasmBinaryFile)&&typeof fetch==="function"){WebAssembly.instantiateStreaming(fetch(wasmBinaryFile,{credentials:"same-origin"}),info).then(receiveInstantiatedSource).catch((function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");instantiateArrayBuffer(receiveInstantiatedSource)}))}else{instantiateArrayBuffer(receiveInstantiatedSource)}return{}}Module["asmPreload"]=Module["asm"];var asmjsReallocBuffer=Module["reallocBuffer"];var wasmReallocBuffer=(function(size){var PAGE_MULTIPLE=Module["usingWasm"]?WASM_PAGE_SIZE:ASMJS_PAGE_SIZE;size=alignUp(size,PAGE_MULTIPLE);var old=Module["buffer"];var oldSize=old.byteLength;if(Module["usingWasm"]){try{var result=Module["wasmMemory"].grow((size-oldSize)/wasmPageSize);if(result!==(-1|0)){return Module["buffer"]=Module["wasmMemory"].buffer}else{return null}}catch(e){return null}}});Module["reallocBuffer"]=(function(size){if(finalMethod==="asmjs"){return asmjsReallocBuffer(size)}else{return wasmReallocBuffer(size)}});var finalMethod="";Module["asm"]=(function(global,env,providedBuffer){env=fixImports(env);if(!env["table"]){var TABLE_SIZE=Module["wasmTableSize"];if(TABLE_SIZE===undefined)TABLE_SIZE=1024;var MAX_TABLE_SIZE=Module["wasmMaxTableSize"];if(typeof WebAssembly==="object"&&typeof WebAssembly.Table==="function"){if(MAX_TABLE_SIZE!==undefined){env["table"]=new WebAssembly.Table({"initial":TABLE_SIZE,"maximum":MAX_TABLE_SIZE,"element":"anyfunc"})}else{env["table"]=new WebAssembly.Table({"initial":TABLE_SIZE,element:"anyfunc"})}}else{env["table"]=new Array(TABLE_SIZE)}Module["wasmTable"]=env["table"]}if(!env["memoryBase"]){env["memoryBase"]=Module["STATIC_BASE"]}if(!env["tableBase"]){env["tableBase"]=0}var exports;exports=doNativeWasm(global,env,providedBuffer);assert(exports,"no binaryen method succeeded.");return exports})}integrateWasmJS();var ASM_CONSTS=[(function(){return Module.getRandomValue()}),(function(){if(Module.getRandomValue===undefined){try{var window_="object"===typeof window?window:self;var crypto_=typeof window_.crypto!=="undefined"?window_.crypto:window_.msCrypto;var randomValuesStandard=(function(){var buf=new Uint32Array(1);crypto_.getRandomValues(buf);return buf[0]>>>0});randomValuesStandard();Module.getRandomValue=randomValuesStandard}catch(e){try{var crypto=require("crypto");var randomValueNodeJS=(function(){var buf=crypto["randomBytes"](4);return(buf[0]<<24|buf[1]<<16|buf[2]<<8|buf[3])>>>0});randomValueNodeJS();Module.getRandomValue=randomValueNodeJS}catch(e){throw"No secure random number generator found"}}}})];function _emscripten_asm_const_i(code){return ASM_CONSTS[code]()}STATIC_BASE=GLOBAL_BASE;STATICTOP=STATIC_BASE+33584;__ATINIT__.push();var STATIC_BUMP=33584;Module["STATIC_BASE"]=STATIC_BASE;Module["STATIC_BUMP"]=STATIC_BUMP;STATICTOP+=16;var SYSCALLS={varargs:0,get:(function(varargs){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret}),getStr:(function(){var ret=Pointer_stringify(SYSCALLS.get());return ret}),get64:(function(){var low=SYSCALLS.get(),high=SYSCALLS.get();if(low>=0)assert(high===0);else assert(high===-1);return low}),getZero:(function(){assert(SYSCALLS.get()===0)})};function ___syscall140(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),offset_high=SYSCALLS.get(),offset_low=SYSCALLS.get(),result=SYSCALLS.get(),whence=SYSCALLS.get();var offset=offset_low;FS.llseek(stream,offset,whence);HEAP32[result>>2]=stream.position;if(stream.getdents&&offset===0&&whence===0)stream.getdents=null;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall146(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.get(),iov=SYSCALLS.get(),iovcnt=SYSCALLS.get();var ret=0;if(!___syscall146.buffers){___syscall146.buffers=[null,[],[]];___syscall146.printChar=(function(stream,curr){var buffer=___syscall146.buffers[stream];assert(buffer);if(curr===0||curr===10){(stream===1?out:err)(UTF8ArrayToString(buffer,0));buffer.length=0}else{buffer.push(curr)}})}for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];for(var j=0;j<len;j++){___syscall146.printChar(stream,HEAPU8[ptr+j])}ret+=len}return ret}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall54(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall6(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD();FS.close(stream);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function _abort(){Module["abort"]()}function _emscripten_memcpy_big(dest,src,num){HEAPU8.set(HEAPU8.subarray(src,src+num),dest);return dest}function ___setErrNo(value){if(Module["___errno_location"])HEAP32[Module["___errno_location"]()>>2]=value;return value}var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};function _sysconf(name){switch(name){case 30:return PAGE_SIZE;case 85:var maxHeapSize=2*1024*1024*1024-65536;maxHeapSize=HEAPU8.length;return maxHeapSize/PAGE_SIZE;case 132:case 133:case 12:case 137:case 138:case 15:case 235:case 16:case 17:case 18:case 19:case 20:case 149:case 13:case 10:case 236:case 153:case 9:case 21:case 22:case 159:case 154:case 14:case 77:case 78:case 139:case 80:case 81:case 82:case 68:case 67:case 164:case 11:case 29:case 47:case 48:case 95:case 52:case 51:case 46:return 200809;case 79:return 0;case 27:case 246:case 127:case 128:case 23:case 24:case 160:case 161:case 181:case 182:case 242:case 183:case 184:case 243:case 244:case 245:case 165:case 178:case 179:case 49:case 50:case 168:case 169:case 175:case 170:case 171:case 172:case 97:case 76:case 32:case 173:case 35:return-1;case 176:case 177:case 7:case 155:case 8:case 157:case 125:case 126:case 92:case 93:case 129:case 130:case 131:case 94:case 91:return 1;case 74:case 60:case 69:case 70:case 4:return 1024;case 31:case 42:case 72:return 32;case 87:case 26:case 33:return 2147483647;case 34:case 1:return 47839;case 38:case 36:return 99;case 43:case 37:return 2048;case 0:return 2097152;case 3:return 65536;case 28:return 32768;case 44:return 32767;case 75:return 16384;case 39:return 1e3;case 89:return 700;case 71:return 256;case 40:return 255;case 2:return 100;case 180:return 64;case 25:return 20;case 5:return 16;case 6:return 6;case 73:return 4;case 84:{if(typeof navigator==="object")return navigator["hardwareConcurrency"]||1;return 1}}___setErrNo(ERRNO_CODES.EINVAL);return-1}DYNAMICTOP_PTR=staticAlloc(4);STACK_BASE=STACKTOP=alignMemory(STATICTOP);STACK_MAX=STACK_BASE+TOTAL_STACK;DYNAMIC_BASE=alignMemory(STACK_MAX);HEAP32[DYNAMICTOP_PTR>>2]=DYNAMIC_BASE;staticSealed=true;var ASSERTIONS=false;function intArrayToString(array){var ret=[];for(var i=0;i<array.length;i++){var chr=array[i];if(chr>255){if(ASSERTIONS){assert(false,"Character code "+chr+" ("+String.fromCharCode(chr)+")  at offset "+i+" not in 0x00-0xFF.")}chr&=255}ret.push(String.fromCharCode(chr))}return ret.join("")}var decodeBase64=typeof atob==="function"?atob:(function(input){var keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{enc1=keyStr.indexOf(input.charAt(i++));enc2=keyStr.indexOf(input.charAt(i++));enc3=keyStr.indexOf(input.charAt(i++));enc4=keyStr.indexOf(input.charAt(i++));chr1=enc1<<2|enc2>>4;chr2=(enc2&15)<<4|enc3>>2;chr3=(enc3&3)<<6|enc4;output=output+String.fromCharCode(chr1);if(enc3!==64){output=output+String.fromCharCode(chr2)}if(enc4!==64){output=output+String.fromCharCode(chr3)}}while(i<input.length);return output});function intArrayFromBase64(s){if(typeof ENVIRONMENT_IS_NODE==="boolean"&&ENVIRONMENT_IS_NODE){var buf;try{buf=Buffer.from(s,"base64")}catch(_){buf=new Buffer(s,"base64")}return new Uint8Array(buf.buffer,buf.byteOffset,buf.byteLength)}try{var decoded=decodeBase64(s);var bytes=new Uint8Array(decoded.length);for(var i=0;i<decoded.length;++i){bytes[i]=decoded.charCodeAt(i)}return bytes}catch(_){throw new Error("Converting base64 string to bytes failed.")}}function tryParseAsDataURI(filename){if(!isDataURI(filename)){return}return intArrayFromBase64(filename.slice(dataURIPrefix.length))}Module["wasmTableSize"]=32;Module["wasmMaxTableSize"]=32;function jsCall_ii(index,a1){return functionPointers[index](a1)}function jsCall_iiii(index,a1,a2,a3){return functionPointers[index](a1,a2,a3)}Module.asmGlobalArg={};Module.asmLibraryArg={"abort":abort,"jsCall_ii":jsCall_ii,"jsCall_iiii":jsCall_iiii,"___syscall140":___syscall140,"___syscall146":___syscall146,"___syscall54":___syscall54,"___syscall6":___syscall6,"_abort":_abort,"_emscripten_asm_const_i":_emscripten_asm_const_i,"_emscripten_memcpy_big":_emscripten_memcpy_big,"_sysconf":_sysconf,"STACKTOP":STACKTOP};var asm=Module["asm"](Module.asmGlobalArg,Module.asmLibraryArg,buffer);Module["asm"]=asm;var ___errno_location=Module["___errno_location"]=(function(){return Module["asm"]["___errno_location"].apply(null,arguments)});var _main=Module["_main"]=(function(){return Module["asm"]["_main"].apply(null,arguments)});var stackAlloc=Module["stackAlloc"]=(function(){return Module["asm"]["stackAlloc"].apply(null,arguments)});Module["asm"]=asm;function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}ExitStatus.prototype=new Error;ExitStatus.prototype.constructor=ExitStatus;var initialStackTop;var calledMain=false;dependenciesFulfilled=function runCaller(){if(!Module["calledRun"])run();if(!Module["calledRun"])dependenciesFulfilled=runCaller};Module["callMain"]=function callMain(args){args=args||[];ensureInitRuntime();var argc=args.length+1;var argv=stackAlloc((argc+1)*4);HEAP32[argv>>2]=allocateUTF8OnStack(Module["thisProgram"]);for(var i=1;i<argc;i++){HEAP32[(argv>>2)+i]=allocateUTF8OnStack(args[i-1])}HEAP32[(argv>>2)+argc]=0;try{var ret=Module["_main"](argc,argv,0);exit(ret,true)}catch(e){if(e instanceof ExitStatus){return}else if(e=="SimulateInfiniteLoop"){Module["noExitRuntime"]=true;return}else{var toLog=e;if(e&&typeof e==="object"&&e.stack){toLog=[e,e.stack]}err("exception thrown: "+toLog);Module["quit"](1,e)}}finally{calledMain=true}};function run(args){args=args||Module["arguments"];if(runDependencies>0){return}preRun();if(runDependencies>0)return;if(Module["calledRun"])return;function doRun(){if(Module["calledRun"])return;Module["calledRun"]=true;if(ABORT)return;ensureInitRuntime();preMain();if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();if(Module["_main"]&&shouldRunNow)Module["callMain"](args);postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout((function(){setTimeout((function(){Module["setStatus"]("")}),1);doRun()}),1)}else{doRun()}}Module["run"]=run;function exit(status,implicit){if(implicit&&Module["noExitRuntime"]&&status===0){return}if(Module["noExitRuntime"]){}else{ABORT=true;EXITSTATUS=status;STACKTOP=initialStackTop;exitRuntime();if(Module["onExit"])Module["onExit"](status)}Module["quit"](status,new ExitStatus(status))}function abort(what){if(Module["onAbort"]){Module["onAbort"](what)}if(what!==undefined){out(what);err(what);what=JSON.stringify(what)}else{what=""}ABORT=true;EXITSTATUS=1;throw"abort("+what+"). Build with -s ASSERTIONS=1 for more info."}Module["abort"]=abort;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}var shouldRunNow=true;if(Module["noInitialRun"]){shouldRunNow=false}Module["noExitRuntime"]=true;run()



