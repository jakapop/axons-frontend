if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister()
    }

    setTimeout(() => {
      window.location.reload()
    }, 2000)
  })
}
