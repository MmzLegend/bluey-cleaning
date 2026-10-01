(() => {
 'use strict';
 const config = window.BLUEY_REVIEWS || {};
 const summary = document.querySelector('#review-summary');
 const list = document.querySelector('#review-list');
 const form = document.querySelector('#public-review-form');
 const status = document.querySelector('#review-status');
 const submit = document.querySelector('#submit-review');
 const more = document.querySelector('#more-reviews');
 let cursor = null, loading = false, widget = null, sending = false;
 let submissionId = crypto.randomUUID();
 const endpoint = config.api ? config.api.replace(/\/$/, '') + '/api/reviews' : '';
 function element(tag, text, className) { const e=document.createElement(tag);e.textContent=text;if(className)e.className=className;return e; }
 async function loadReviews(append=false) {
  if (!endpoint) { summary.textContent='Public reviews are being set up. Please check back soon.'; return; }
  if(loading)return;loading=true;more.disabled=true;
  try {
   const response=await fetch(endpoint+(append&&cursor?'?before='+encodeURIComponent(cursor):''),{cache:'no-store',signal:AbortSignal.timeout(15000)});
   if(!response.ok)throw Error();
   const data=await response.json();
   if(!append)list.replaceChildren();
   summary.textContent=data.summary.count ? `${Number(data.summary.average).toFixed(1)} out of 5 · ${data.summary.count} published ${data.summary.count===1?'review':'reviews'}` : 'No published reviews yet. Be the first to share your experience.';
   for(const r of data.reviews){
    const card=element('article','','review-card');
    const stars=element('p','★'.repeat(r.rating)+'☆'.repeat(5-r.rating),'review-stars');stars.setAttribute('aria-label',r.rating+' out of 5 stars');
    const quote=element('p',r.comment,'review-comment');
    card.append(stars,quote,element('h3',r.display_name),element('p',r.service+' · '+new Date(r.created_at).toLocaleDateString('en-GB',{month:'short',year:'numeric'}),'review-meta'));
    list.append(card);
   }
   cursor=data.next;more.hidden=!cursor;
  }catch{summary.textContent='Reviews could not be loaded. Please try again.';document.querySelector('#retry-reviews').hidden=false;}
  finally{loading=false;more.disabled=false;}
 }
 document.querySelector('#retry-reviews').onclick=event=>{event.currentTarget.hidden=true;loadReviews();};
 more.onclick=()=>loadReviews(true);
 function ready(){submit.disabled=sending || !window.turnstile?.getResponse(widget);}
 window.blueyReviewSecurityReady = () => {
  if(!endpoint || !config.sitekey)return;
  widget=window.turnstile.render('#review-security',{sitekey:config.sitekey,action:'review',callback:ready,'expired-callback':ready,'error-callback':()=>{submit.disabled=true;status.textContent='The security check could not load. Please refresh and try again.';}});
 };
 if(endpoint && config.sitekey){const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?onload=blueyReviewSecurityReady&render=explicit';script.async=true;script.defer=true;script.onerror=()=>{status.textContent='The security check could not load. Please refresh and try again.';};document.head.append(script);}
 else status.textContent='The public review form is being connected. Submissions are not open yet.';
 form.addEventListener('input',()=>{document.querySelector('#public-comment').setCustomValidity('');document.querySelector('#public-name').setCustomValidity('');const selected=form.querySelector('[name="rating"]:checked');form.querySelectorAll('.star-option').forEach(label=>label.classList.toggle('selected',!!selected&&Number(label.dataset.value)<=Number(selected.value)));});
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(sending||!endpoint||widget===null)return;
  const name=document.querySelector('#public-name'),comment=document.querySelector('#public-comment');
  if(name.value.trim().length<2){name.setCustomValidity('Please enter at least two characters for your display name.');name.reportValidity();return;}
  if(comment.value.trim().length<10){comment.setCustomValidity('Please write at least 10 characters about your experience.');comment.reportValidity();return;}
  const token=window.turnstile.getResponse(widget);if(!token){status.textContent='Please complete the security check.';return;}
  const data=new FormData(form);
  const payload={id:submissionId,display_name:name.value.trim(),rating:Number(data.get('rating')),comment:comment.value.trim(),service:data.get('review-service'),consent:data.get('publish-consent')==='on',website:data.get('website'),token};
  sending=true;submit.disabled=true;status.textContent='Saving your review…';
  try{
   const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
   const result=await response.json();if(!response.ok)throw Error(result.error||'Your review could not be saved. Please try again.');
   form.reset();form.querySelectorAll('.star-option').forEach(label=>label.classList.remove('selected'));submissionId=crypto.randomUUID();status.textContent=result.message;status.focus();
  }catch(error){status.textContent=error.name==='TimeoutError'?'The connection timed out. Please retry; your review will not be saved twice.':error.message;}
  finally{sending=false;window.turnstile.reset(widget);submit.disabled=true;}
 });
 loadReviews();
})();
