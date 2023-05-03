
  // sends post and then reacts accordingly based on response
  const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
  
    if(result.redirect) {
      window.location = result.redirect;
    }

    if (handler) {
        handler(result);
    }
  };


  const delay = (delayInms) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, delayInms);
    });
  
  }

  module.exports = {
    sendPost,
    delay
  }