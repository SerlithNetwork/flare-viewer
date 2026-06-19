export default function () {
  const toast = useToast();

  function onResponseError() {
    toast.add({
      title: "Error",
      description: "Failed to process request",
      icon: "uil:times-circle",
      color: "error",
    });
  }

  function onRequestError() {
    toast.add({
      title: "Error",
      description: "Service unavailable, please try again later",
      icon: "uil:times-circle",
      color: "error",
    });
  }

  return {
    onRequestError,
    onResponseError,
  };
}
