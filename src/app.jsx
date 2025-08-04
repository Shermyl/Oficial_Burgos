// src/App.js
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { supabase } from './services/supabase';

const PrivateRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.session();
    const getProfile = async () => {
      if (session?.user) {
        const { data } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(data);
      }
      setLoading(false);
    };
    getProfile();

    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getProfile();
      } else {
        setUser(null);
      }
    });

    return () => authListener.data?.unsubscribe();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          allowedRoles.includes(user.rol) ? (
            <Component {...props} user={user} />
          ) : (
            <Redirect to="/" />
          )
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

function App() {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/menu" component={Menu} />
      
      <PrivateRoute 
        path="/admin" 
        component={AdminDashboard} 
        allowedRoles={['administrador']} 
      />
      <PrivateRoute
        path="/chef"
        component={ChefOrders}
        allowedRoles={['administrador', 'chef']}
      />
    </Router>
    );
}