(() => {
  // User-friendly sync notice without blocking the page.
  window.addEventListener('lexora:sync-warning',()=>{
    const toast=document.querySelector('#toast');if(!toast)return;
    toast.textContent='Kamu tetap bisa belajar. Sinkronisasi cloud akan dicoba lagi.';
    toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3000);
  });
  // Make navigation keyboard/mobile friendly.
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      document.querySelector('#sidebar')?.classList.remove('open');
      document.querySelector('#languagePickerModal')?.classList.remove('show');
    }
  });
})();
