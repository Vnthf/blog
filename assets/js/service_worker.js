if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {
    scope: '/blog/'
  }).then(function(registration) {
    console.log('서비스워커가 등록 성공 ', registration.scope);
  }).catch(function(err) {
    console.log('서비스워커의 등록 실패: ', err);
  });
}


