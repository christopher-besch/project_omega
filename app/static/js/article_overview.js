(()=>{"use strict";document.body.onload=()=>{!function(){let t=document.getElementsByClassName("moment-from-now");for(let e of t){let t=moment.utc(e.dataset.time,"YYYY-MM-DD HH:mm:ss.SSS");e.innerText=t.fromNow()}}()}})();