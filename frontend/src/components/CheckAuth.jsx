import React, { useLayoutEffect, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CheckAuth({ children, protectedRoute }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function checkAuthLogic() {
      window.scrollTo(0, 0);
      const token = localStorage.getItem('token');

      if (protectedRoute) {
        if (!token) {
          navigate('/login', { replace: true });
          setLoading(false);
        } else {
          setLoading(false);
        }
      } else {
        if (token) {
          navigate('/', { replace: true });
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    }

    checkAuthLogic();
  }, [navigate, protectedRoute]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <span className="loading loading-spinner loading-xl text-success" />
      </div>
    );
  }

  return children;
}

export default CheckAuth;
