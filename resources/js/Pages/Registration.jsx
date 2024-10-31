import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    AlertCircle,
    CheckCircle2,
    Users,
    Hash,
    BookOpen,
    ArrowRight,
    Search,
    PieChart,
    ChevronLeft
} from 'lucide-react';

const RegistrationPage = () => {
    // Estados
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        identificacion: '',
        correo: ''
    });
    const [registrations, setRegistrations] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('form');
    const [currentStep, setCurrentStep] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [statsLoading, setStatsLoading] = useState(false);
    const [stats, setStats] = useState({
        totalAssigned: 0,
        totalAvailable: 9999,
        percentage: 0
    });

    // Pasos del formulario
    const steps = [
        {
            field: 'nombre',
            label: 'Nombre Completo',
            type: 'text',
            placeholder: 'Ingresa tu nombre completo',
            validation: (value) => value.length >= 3 ? null : 'El nombre debe tener al menos 3 caracteres'
        },
        {
            field: 'telefono',
            label: 'Teléfono',
            type: 'tel',
            placeholder: 'Ingresa tu número de teléfono',
            validation: (value) => /^\d{10}$/.test(value) ? null : 'Ingresa un número de teléfono válido (10 dígitos)'
        },
        {
            field: 'identificacion',
            label: 'Identificación',
            type: 'text',
            placeholder: 'Ingresa tu número de identificación',
            validation: (value) => value.length >= 5 ? null : 'La identificación debe tener al menos 5 caracteres'
        },
        {
            field: 'correo',
            label: 'Correo Electrónico',
            type: 'email',
            placeholder: 'Ingresa tu correo electrónico',
            validation: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Ingresa un correo electrónico válido'
        }
    ];

    // Reglas del registro
    const rules = [
        "El Participante debe estar presente el evento",
        "Debe presentar su documento de Identidad",
        "Cada participante puede registrarse una sola vez",
        "Se te asignará un número único entre 0000 y 9999",
        "Recibirás un correo con la confirmación y tu número",
        "El registro es personal e intransferible",
        "Conserva tu número para futura referencia"
    ];

    // Efectos
    useEffect(() => {
        fetchRegistrations();
        fetchStats();
    }, []);

    // Funciones
    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const response = await axios.get('/api/registration-stats');
            const totalAssigned = response.data.total_assigned;
            setStats({
                totalAssigned,
                totalAvailable: 9999,
                percentage: (totalAssigned / 9999) * 100
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    const fetchRegistrations = async () => {
        try {
            const response = await axios.get('/api/registrations');
            setRegistrations(response.data.registrations);
        } catch (error) {
            setError('Error al cargar los registros');
        }
    };

    const validateCurrentStep = () => {
        const currentField = steps[currentStep].field;
        const validationResult = steps[currentStep].validation(formData[currentField]);
        if (validationResult) {
            setError(validationResult);
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateCurrentStep()) {
            return;
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('/api/register', formData);
            setSuccess('¡Registro exitoso! Revisa tu correo electrónico.');
            setFormData({ nombre: '', telefono: '', identificacion: '', correo: '' });
            await Promise.all([fetchRegistrations(), fetchStats()]);
            setCurrentStep(0);
        } catch (error) {
            if (error.response?.data?.errors) {
                setError('Por favor verifica los datos ingresados.');
            } else {
                setError('Error al procesar el registro.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePreviousStep = () => {
        setCurrentStep(Math.max(0, currentStep - 1));
        setError('');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const filteredRegistrations = registrations.filter(reg =>
        reg.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.identificacion.includes(searchTerm) ||
        reg.numero_asignado.includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Registro de Participantes Actividad NMAX 0Km Pool Party GBR & KBU Beach
                    </h1>
                    <p className="text-lg text-gray-600">
                        Completa el formulario para obtener tu número único para participar en la actividad.
                    </p>
                </div>

                {/* Stats Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-blue-600">
                            <PieChart className="w-6 h-6 mr-2" />
                            <h2 className="text-xl font-semibold">Estado de Registros</h2>
                        </div>
                        <div className="text-sm text-gray-500">
                            Total disponible: 9999
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Números asignados: {stats.totalAssigned}</span>
                            <span>{stats.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500 ease-in-out"
                                style={{ width: `${stats.percentage}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 text-center">
                            Números disponibles: {9999 - stats.totalAssigned}
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
                        <button
                            className={`px-6 py-2 rounded-md transition-all ${activeTab === 'form'
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            onClick={() => setActiveTab('form')}
                        >
                            Registro
                        </button>
                        <button
                            className={`px-6 py-2 rounded-md transition-all ${activeTab === 'list'
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            onClick={() => setActiveTab('list')}
                        >
                            Participantes
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Rules Section */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center mb-4 text-blue-600">
                                <BookOpen className="w-6 h-6 mr-2" />
                                <h2 className="text-xl font-semibold">Reglas</h2>
                            </div>
                            <ul className="space-y-4">
                                {rules.map((rule, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-3">
                                            <span className="text-blue-600 text-sm font-semibold">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <span className="text-gray-600">{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2">
                        {activeTab === 'form' ? (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                {/* Progress Bar */}
                                <div className="mb-8">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">
                                            Paso {currentStep + 1} de {steps.length}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {Math.round(((currentStep + 1) / steps.length) * 100)}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full">
                                        <div
                                            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-6">
                                        {steps.map((step, index) => (
                                            <div
                                                key={step.field}
                                                className={`transition-all duration-300 ${index === currentStep
                                                        ? 'opacity-100 transform translate-x-0'
                                                        : 'opacity-0 absolute -translate-x-full'
                                                    }`}
                                            >
                                                {index === currentStep && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            {step.label}
                                                        </label>
                                                        <input
                                                            type={step.type}
                                                            name={step.field}
                                                            value={formData[step.field]}
                                                            onChange={handleChange}
                                                            placeholder={step.placeholder}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                            required
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {error && (
                                        <div className="flex items-center p-4 text-red-800 bg-red-50 rounded-lg">
                                            <AlertCircle className="w-5 h-5 mr-2" />
                                            <p>{error}</p>
                                        </div>
                                    )}

                                    {success && (
                                        <div className="flex items-center p-4 text-green-800 bg-green-50 rounded-lg">
                                            <CheckCircle2 className="w-5 h-5 mr-2" />
                                            <p>{success}</p>
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-4">
                                        {currentStep > 0 && (
                                            <button
                                                type="button"
                                                onClick={handlePreviousStep}
                                                className="flex items-center justify-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <ChevronLeft className="w-4 h-4 mr-2" />
                                                Anterior
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <span>
                                                {currentStep === steps.length - 1 ? 'Registrar' : 'Siguiente'}
                                            </span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                                    <div className="flex items-center text-blue-600 mb-4 sm:mb-0">
                                        <Users className="w-6 h-6 mr-2" />
                                        <h2 className="text-xl font-semibold">Participantes Registrados</h2>
                                    </div>
                                    <div className="w-full sm:w-64">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Buscar participante..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>
                                </div>

                                {filteredRegistrations.length > 0 ? (
                                    <div>
                                        {/* Vista de escritorio - Tabla */}
                                        <div className="hidden md:block overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Nombre
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Identificación
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Número Asignado
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Fecha
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {filteredRegistrations.map((reg) => (
                                                        <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {reg.nombre}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                                {reg.identificacion}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                                    <Hash className="w-4 h-4 mr-1" />
                                                                    {reg.numero_asignado}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                                {new Date(reg.created_at).toLocaleDateString('es-ES', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Vista móvil - Tarjetas */}
                                        <div className="md:hidden space-y-4">
                                            {filteredRegistrations.map((reg) => (
                                                <div key={reg.id} className="bg-white rounded-lg shadow-sm p-4 space-y-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-medium text-gray-900">{reg.nombre}</h3>
                                                            <p className="text-sm text-gray-600">ID: {reg.identificacion}</p>
                                                        </div>
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                            <Hash className="w-4 h-4 mr-1" />
                                                            {reg.numero_asignado}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(reg.created_at).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        {searchTerm ? (
                                            <div className="space-y-3">
                                                <Search className="w-12 h-12 text-gray-400 mx-auto" />
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    No se encontraron resultados
                                                </h3>
                                                <p className="text-gray-500">
                                                    No hay participantes que coincidan con "{searchTerm}"
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <Users className="w-12 h-12 text-gray-400 mx-auto" />
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    No hay participantes registrados
                                                </h3>
                                                <p className="text-gray-500">
                                                    Los participantes aparecerán aquí una vez que se registren
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {filteredRegistrations.length > 0 && (
                                    <div className="mt-4 text-sm text-gray-500 text-right">
                                        Total de registros mostrados: {filteredRegistrations.length}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;
