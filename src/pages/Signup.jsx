// // src/pages/Signup.jsx
// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
// import { useSignup } from '../hooks/useAuth';
// import { theme } from '../theme';

// const Signup = () => {
//   const navigate = useNavigate();
//   const signupMutation = useSignup();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [formData, setFormData] = useState({
//     full_name: '',
//     email: '',
//     password: '',
//     confirm_password: '',
//   });
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (formData.password !== formData.confirm_password) {
//       setError('Passwords do not match');
//       return;
//     }
//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters');
//       return;
//     }

//     try {
//       const result = await signupMutation.mutateAsync({
//         full_name: formData.full_name,
//         email: formData.email,
//         password: formData.password,
//         confirm_password: formData.confirm_password,
//       });
//       if (result.success) {
//         navigate('/welcome');
//       } else {
//         setError(result.message || 'Signup failed');
//       }
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Failed to create account');
//     }
//   };

//   return (
//     <iv className={theme.page.canvas}>
//       <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
//         <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
//           <div className="space-y-6">
//             <span className="inline-flex rounded-full bg-[#f8f5ee] px-4 py-2 text-sm font-semibold text-[#6b7280]">
//               SecureWatch Registration
//             </span>
//             <div className="max-w-xl">
//               <h1 className={`${theme.type.display} mb-4`}>Create your account.</h1>
//               <p className={`${theme.type.body} text-lg leading-8`}>Start managing your properties, cameras, and alerts from a polished web dashboard that is built for desktop workflows.</p>
//               <ul className="mt-6 space-y-3 text-sm text-gray-600">
//                 <li>• Fast onboarding for property surveillance</li>
//                 <li>• Secure access controls and team management</li>
//                 <li>• Responsive design for desktop and tablet</li>
//               </ul>
//             </div>
//           </div>

//           <div className="mx-auto w-full max-w-md">
//             <div className={theme.card.lg}>

//               {/* Brand header */}
//               <div className="flex flex-col items-center gap-2 mb-8">
//                 <div className={theme.divider.goldSm} />
//                 <h1 className={theme.type.h2}>SecureWatch</h1>
//                 <p className={theme.type.label}>Property Surveillance</p>
//                 <div className={theme.divider.goldSm} />
//               </div>

//               {/* Page title */}
//               <h2 className={`${theme.type.h3} text-center mb-6`}>Create Account</h2>

//               {/* Error */}
//               {error && (
//                 <div className={`${theme.alert.error} mb-5`}>
//                   {error}
//                 </div>
//               )}

//               {/* Form */}
//               <form onSubmit={handleSubmit} className={theme.form.section}>

//             {/* Full name */}
//             <div className={theme.input.wrapper}>
//               <User className={theme.input.iconLeft} />
//               <input
//                 name="full_name"
//                 type="text"
//                 placeholder="Full name"
//                 value={formData.full_name}
//                 onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
//                 className={theme.input.withIcon}
//                 required
//                 disabled={signupMutation.isPending}
//               />
//             </div>

//             {/* Email */}
//             <div className={theme.input.wrapper}>
//               <Mail className={theme.input.iconLeft} />
//               <input
//                 name="email"
//                 type="email"
//                 placeholder="Email address"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 className={theme.input.withIcon}
//                 required
//                 disabled={signupMutation.isPending}
//               />
//             </div>

//             {/* Password */}
//             <div className={theme.input.wrapper}>
//               <Lock className={theme.input.iconLeft} />
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 className={theme.input.withIconRight}
//                 required
//                 disabled={signupMutation.isPending}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className={theme.input.iconRight}
//                 disabled={signupMutation.isPending}
//               >
//                 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </button>
//             </div>

//             {/* Confirm password */}
//             <div className={theme.input.wrapper}>
//               <Lock className={theme.input.iconLeft} />
//               <input
//                 type={showConfirm ? 'text' : 'password'}
//                 placeholder="Confirm password"
//                 value={formData.confirm_password}
//                 onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
//                 className={theme.input.withIconRight}
//                 required
//                 disabled={signupMutation.isPending}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirm(!showConfirm)}
//                 className={theme.input.iconRight}
//                 disabled={signupMutation.isPending}
//               >
//                 {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </button>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={signupMutation.isPending}
//               className={`${theme.button.primary} ${theme.button.full}`}
//             >
//               {signupMutation.isPending ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   Creating account...
//                 </>
//               ) : 'Sign Up'}
//             </button>

//           </form>

//           {/* Footer */}
//           <p className={`${theme.type.bodySm} text-center mt-6`}>
//             Already have an account?{' '}
//             <Link to="/login" className={theme.type.link}>Login</Link>
//           </p>

//         </div>
//       </div>
//     </div>
//   </div>
//   </iv>
//   );
// }

// export default Signup;
// src/pages/Signup.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useSignup } from '../hooks/useAuth';
import { theme } from '../theme';
import logo from '../assets/logo.jpeg';

const Signup = () => {
  const navigate = useNavigate();
  const signupMutation = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '', confirm_password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match'); return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters'); return;
    }
    try {
      const result = await signupMutation.mutateAsync({
        full_name:        formData.full_name,
        email:            formData.email,
        password:         formData.password,
        confirm_password: formData.confirm_password,
      });
      if (result.success) navigate('/welcome');
      else setError(result.message || 'Signup failed');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex">

      {/* ── Left: Form panel ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-10 sm:px-24 py-12">

        {/* Heading — centred at top of form */}
        <div className="text-center mb-10">
          <h1 className={`${theme.type.h1} mb-2`}>Create account.</h1>
          <p className={theme.type.body}>Start protecting your properties today</p>
        </div>

        {error && <div className={`${theme.alert.error} mb-6`}>{error}</div>}

        <form onSubmit={handleSubmit} className={theme.form.section}>

          <div className={theme.input.wrapper}>
            <User className={theme.input.iconLeft} />
            <input
              type="text"
              placeholder="Full name"
              value={formData.full_name}
              onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              className={theme.input.withIcon}
              required
              disabled={signupMutation.isPending}
            />
          </div>

          <div className={theme.input.wrapper}>
            <Mail className={theme.input.iconLeft} />
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className={theme.input.withIcon}
              required
              disabled={signupMutation.isPending}
            />
          </div>

          <div className={theme.input.wrapper}>
            <Lock className={theme.input.iconLeft} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className={theme.input.withIconRight}
              required
              disabled={signupMutation.isPending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className={theme.input.iconRight}
              disabled={signupMutation.isPending}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className={theme.input.wrapper}>
            <Lock className={theme.input.iconLeft} />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm password"
              value={formData.confirm_password}
              onChange={e => setFormData({ ...formData, confirm_password: e.target.value })}
              className={theme.input.withIconRight}
              required
              disabled={signupMutation.isPending}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(p => !p)}
              className={theme.input.iconRight}
              disabled={signupMutation.isPending}
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={signupMutation.isPending}
            className={`${theme.button.primary} ${theme.button.full} mt-2`}
          >
            {signupMutation.isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
              : 'Sign Up'}
          </button>
        </form>

        <p className={`${theme.type.bodySm} text-center mt-8`}>
          Already have an account?{' '}
          <Link to="/login" className={theme.type.link}>Login</Link>
        </p>
      </div>

      {/* ── Right: Semicircle + Logo ── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-[#f0ebe0]">

        {/* Semicircle */}
        <div
          style={{
            position:     'absolute',
            right:        '-300px',
            top:          '50%',
            transform:    'translateY(-50%)',
            width:        '700px',
            height:       '700px',
            borderRadius: '50%',
            background:   'radial-gradient(circle at 30% 50%, #d4b896 0%, #c5a880 40%, #a07850 100%)',
          }}
        />

        {/* Logo centred on circle */}
        <div
          style={{
            position:  'absolute',
            right:     '0px',
            top:       '50%',
            transform: 'translate(-300px, -50%)',
            zIndex:    10,
          }}
        >
          <img
            src={logo}
            alt="SecureWatch"
            style={{
              width:        '200px',
              height:       '200px',
              borderRadius: '50%',
              objectFit:    'cover',
              border:       '6px solid rgba(255,255,255,0.75)',
              boxShadow:    '0 16px 48px rgba(0,0,0,0.22)',
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default Signup;