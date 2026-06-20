import { useEffect } from "react";
import { useLocation } from "wouter";

export function useAdminAuth() {
  const [location, setLocation] = useLocation();
  const token = localStorage.getItem('vortex_admin_token');

  useEffect(() => {
    if (!token && location.startsWith('/admin') && location !== '/admin/login') {
      setLocation('/admin/login');
    }
  }, [token, location, setLocation]);

  return { isAuthenticated: !!token };
}
