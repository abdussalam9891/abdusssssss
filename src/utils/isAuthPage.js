 

export function isAuthPage() {
  const path = window.location.pathname.toLowerCase();

  return (
    path.endsWith("/login.html") ||
    path.endsWith("/register.html") ||
    path.endsWith("/forgotpassword.html")
  );
}
