// Página de registro - Implementar formulario completo con validación
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Registro de Médico</h1>
        <p className="text-center text-gray-600 mb-8">
          Complete el formulario para crear su cuenta
        </p>
        {/* Implementar formulario de registro con todos los campos del BDD/SDD */}
        <div className="text-center mt-6">
          <Link to="/login" className="text-primary-600 hover:text-primary-700">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
