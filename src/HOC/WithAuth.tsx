const WithAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const accessToken = localStorage.getItem("currentUser");
    if (!accessToken) {
      window.location.replace("/login");

      return null;
    }
    return <WrappedComponent {...props} />;
  };
};

export default WithAuth;
