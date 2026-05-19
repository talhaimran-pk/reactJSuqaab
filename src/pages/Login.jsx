// // // // src/pages/Login.jsx
// // // import { useState } from 'react';
// // // import { Link, useNavigate } from 'react-router-dom';
// // // import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
// // // import { useLogin } from '../hooks/useAuth';
// // // import { usePropertyStore } from '../store/propertyStore';
// // // import { theme } from '../theme';

// // // const Login = () => {
// // //   const navigate = useNavigate();
// // //   const loginMutation = useLogin();
// // //   const [showPassword, setShowPassword] = useState(false);
// // //   const [formData, setFormData] = useState({ email: '', password: '' });
// // //   const [error, setError] = useState('');

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setError('');
// // //     try {
// // //       const result = await loginMutation.mutateAsync({
// // //         email: formData.email,
// // //         password: formData.password,
// // //       });
// // //       if (result.success) {
// // //         const properties = usePropertyStore.getState().properties;
// // //         navigate(properties.length === 0 ? '/welcome' : '/properties');
// // //       } else {
// // //         setError(result.message || 'Login failed');
// // //       }
// // //     } catch (err) {
// // //       setError(err.response?.data?.detail || 'Invalid email or password');
// // //     }
// // //   };

// // //   return (
// // //     <div className={theme.page.canvas}>
// // //       <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
// // //         <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
// // //           <div className="space-y-6">
// // //             <span className="inline-flex rounded-full bg-[#f8f5ee] px-4 py-2 text-sm font-semibold text-[#6b7280]">
// // //               SecureWatch Portal
// // //             </span>
// // //             <div className="max-w-xl">
// // //               <h1 className={`${theme.type.display} mb-4`}>Welcome Back.</h1>
// // //               <p className={`${theme.type.body} text-lg leading-8`}>Sign in to manage your properties, cameras, alerts, and team access from a modern web dashboard built for desktop productivity.</p>
// // //             </div>
// // //           </div>

// // //           <div className="mx-auto w-full max-w-md">
// // //             <div className={theme.card.lg}>

// // //               {/* Logo */}
// // //               <div className="flex justify-center mb-8">
// // //                 <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#c5a880]/30 shadow-sm">
// // //                   <img src="/logo.png" alt="SecureWatch" className="w-full h-full object-cover" />
// // //                 </div>
// // //               </div>

// // //               {/* Heading */}
// // //               <h1 className={`${theme.type.h2} text-center mb-1`}>Welcome Back</h1>
// // //               <p className={`${theme.type.bodySm} text-center mb-8`}>Secure your world with smart monitoring</p>

// // //               {/* Error */}
// // //               {error && (
// // //                 <div className={`${theme.alert.error} mb-5`}>{error}</div>
// // //               )}

// // //               <form onSubmit={handleSubmit} className={theme.form.section}>

// // //             {/* Email */}
// // //             <div className={theme.input.wrapper}>
// // //               <Mail className={theme.input.iconLeft} />
// // //               <input
// // //                 name="email"
// // //                 type="email"
// // //                 placeholder="Enter your email"
// // //                 value={formData.email}
// // //                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// // //                 className={theme.input.withIcon}
// // //                 required
// // //                 disabled={loginMutation.isPending}
// // //               />
// // //             </div>

// // //             {/* Password */}
// // //             <div className={theme.input.wrapper}>
// // //               <Lock className={theme.input.iconLeft} />
// // //               <input
// // //                 type={showPassword ? 'text' : 'password'}
// // //                 placeholder="Enter your password"
// // //                 value={formData.password}
// // //                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
// // //                 className={theme.input.withIconRight}
// // //                 required
// // //                 disabled={loginMutation.isPending}
// // //               />
// // //               <button
// // //                 type="button"
// // //                 onClick={() => setShowPassword(!showPassword)}
// // //                 className={theme.input.iconRight}
// // //                 disabled={loginMutation.isPending}
// // //               >
// // //                 {showPassword
// // //                   ? <EyeOff className="w-5 h-5" />
// // //                   : <Eye className="w-5 h-5" />}
// // //               </button>
// // //             </div>

// // //             {/* Submit */}
// // //             <button
// // //               type="submit"
// // //               disabled={loginMutation.isPending}
// // //               className={`${theme.button.primary} ${theme.button.full}`}
// // //             >
// // //               {loginMutation.isPending ? (
// // //                 <>
// // //                   <Loader2 className="w-5 h-5 animate-spin" />
// // //                   Logging in...
// // //                 </>
// // //               ) : 'Login'}
// // //             </button>

// // //           </form>

// // //           {/* Sign up link */}
// // //           <p className={`${theme.type.bodySm} text-center mt-6`}>
// // //             Don't have an account?{' '}
// // //             <Link to="/signup" className={theme.type.link}>Sign Up</Link>
// // //           </p>

// // //         </div>
// // //       </div>
// // //     </div>
// // //   </div>
// // //   </div>
// // //   );
  
// // // }

// // // export default Login;

// // // src/pages/Login.jsx
// // import { useState } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
// // import { useLogin } from '../hooks/useAuth';
// // import { theme } from '../theme';
// // import logo from '../assets/logo.jpeg';

// // const Login = () => {
// //   const navigate = useNavigate();
// //   const loginMutation = useLogin();
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [formData, setFormData] = useState({ email: '', password: '' });
// //   const [error, setError] = useState('');

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError('');
// //     try {
// //       const result = await loginMutation.mutateAsync(formData);
// //       if (result.success) {
// //         navigate('/welcome');
// //       } else {
// //         setError(result.message || 'Login failed');
// //       }
// //     } catch (err) {
// //       setError(err.response?.data?.detail || 'Invalid email or password');
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-[#faf9f6] flex">

// //       {/* ── Left: Form panel ──────────────────────────────────────── */}
// //       <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-16 py-12">

// //         {/* Logo */}
// //         <div className="mb-10">
// //           <img src={logo} alt="SecureWatch" className="h-12 w-auto object-contain" />
// //         </div>

// //         {/* Heading */}
// //         <div className="mb-8">
// //           <h1 className={`${theme.type.h1} mb-2`}>Welcome back.</h1>
// //           <p className={theme.type.body}>Sign in to your SecureWatch account</p>
// //         </div>

// //         {/* Error */}
// //         {error && (
// //           <div className={`${theme.alert.error} mb-6`}>{error}</div>
// //         )}

// //         {/* Form */}
// //         <form onSubmit={handleSubmit} className={theme.form.section}>

// //           <div className={theme.input.wrapper}>
// //             <Mail className={theme.input.iconLeft} />
// //             <input
// //               type="email"
// //               placeholder="Email address"
// //               value={formData.email}
// //               onChange={e => setFormData({ ...formData, email: e.target.value })}
// //               className={theme.input.withIcon}
// //               required
// //               disabled={loginMutation.isPending}
// //             />
// //           </div>

// //           <div className={theme.input.wrapper}>
// //             <Lock className={theme.input.iconLeft} />
// //             <input
// //               type={showPassword ? 'text' : 'password'}
// //               placeholder="Password"
// //               value={formData.password}
// //               onChange={e => setFormData({ ...formData, password: e.target.value })}
// //               className={theme.input.withIconRight}
// //               required
// //               disabled={loginMutation.isPending}
// //             />
// //             <button
// //               type="button"
// //               onClick={() => setShowPassword(p => !p)}
// //               className={theme.input.iconRight}
// //               disabled={loginMutation.isPending}
// //             >
// //               {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
// //             </button>
// //           </div>

// //           {/* Forgot password */}
// //           <div className="flex justify-end -mt-2">
// //             <button type="button" className={`${theme.type.link} text-sm`}>
// //               Forgot your password?
// //             </button>
// //           </div>

// //           <button
// //             type="submit"
// //             disabled={loginMutation.isPending}
// //             className={`${theme.button.primary} ${theme.button.full} mt-2`}
// //           >
// //             {loginMutation.isPending
// //               ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
// //               : 'Login'}
// //           </button>
// //         </form>

// //         {/* Footer */}
// //         <p className={`${theme.type.bodySm} text-center mt-8`}>
// //           Don't have an account?{' '}
// //           <Link to="/signup" className={theme.type.link}>Sign Up</Link>
// //         </p>
// //       </div>

// //       {/* ── Right: Illustration panel ─────────────────────────────── */}
// //       <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden
// //                       bg-gradient-to-br from-[#c5a880]/20 via-[#e6e3db] to-[#faf9f6]
// //                       items-center justify-center">

// //         {/* Decorative circles — mirroring the reference */}
// //         <div className="absolute right-[-80px] top-1/2 -translate-y-1/2
// //                         w-[520px] h-[520px] rounded-full
// //                         bg-[#c5a880]/15 border border-[#c5a880]/20" />
// //         <div className="absolute right-[-20px] top-1/2 -translate-y-1/2
// //                         w-[380px] h-[380px] rounded-full
// //                         bg-[#c5a880]/20 border border-[#c5a880]/25" />
// //         <div className="absolute right-[60px] top-1/2 -translate-y-1/2
// //                         w-[240px] h-[240px] rounded-full
// //                         bg-[#c5a880]/30" />

// //         {/* Content card */}
// //         <div className="relative z-10 text-center px-12 max-w-md">
// //           {/* Isometric laptop illustration placeholder */}
// //           <div className="w-72 h-52 mx-auto mb-8 rounded-[2rem]
// //                           bg-white/60 backdrop-blur border border-[#e6e3db]
// //                           shadow-[0_8px_40px_rgba(197,168,128,0.25)]
// //                           flex flex-col items-center justify-center gap-3">
// //             <div className="w-16 h-16 rounded-[1.25rem] bg-[#c5a880]/20
// //                             flex items-center justify-center">
// //               <img src={logo} alt="logo" className="w-10 h-10 object-contain rounded-xl" />
// //             </div>
// //             <p className={`${theme.type.h4} text-[#c5a880]`}>SecureWatch</p>
// //             <p className={`${theme.type.label} px-4`}>Property Surveillance Platform</p>
// //           </div>

// //           <h2 className={`${theme.type.h2} mb-3`}>Smart Security,<br/>Simplified.</h2>
// //           <p className={`${theme.type.body} mb-6`}>
// //             Monitor your properties with AI-powered cameras, real-time alerts,
// //             and intelligent threat detection — all from one dashboard.
// //           </p>

// //           <div className="flex justify-center gap-6 text-center">
// //             {[
// //               { val: 'AI', label: 'Detection' },
// //               { val: '24/7', label: 'Monitoring' },
// //               { val: '∞', label: 'Cameras' },
// //             ].map(({ val, label }) => (
// //               <div key={label} className="flex flex-col items-center">
// //                 <span className={`${theme.type.stat} text-2xl text-[#c5a880]`}>{val}</span>
// //                 <span className={theme.type.label}>{label}</span>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //     </div>
// //   );
// // };

// // export default Login;

// // src/pages/Login.jsx
// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
// import { useLogin } from '../hooks/useAuth';
// import { theme } from '../theme';
// import logo from '../assets/logo.jpeg';

// const Login = () => {
//   const navigate = useNavigate();
//   const loginMutation = useLogin();
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const result = await loginMutation.mutateAsync(formData);
//       if (result.success) {
//         navigate('/welcome');
//       } else {
//         setError(result.message || 'Login failed');
//       }
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Invalid email or password');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#faf9f6] flex">

//       {/* ── Left: Form panel ── */}
//       <div className="w-full lg:w-1/2 flex flex-col justify-center px-10 sm:px-20 py-12">

//         {/* Logo */}
//         <div className="mb-10">
//           <img src={logo} alt="SecureWatch" className="h-12 w-auto object-contain" />
//         </div>

//         {/* Heading */}
//         <div className="mb-8">
//           <h1 className={`${theme.type.h1} mb-2`}>Welcome back.</h1>
//           <p className={theme.type.body}>Sign in to your SecureWatch account</p>
//         </div>

//         {error && <div className={`${theme.alert.error} mb-6`}>{error}</div>}

//         <form onSubmit={handleSubmit} className={theme.form.section}>

//           <div className={theme.input.wrapper}>
//             <Mail className={theme.input.iconLeft} />
//             <input
//               type="email"
//               placeholder="Email address"
//               value={formData.email}
//               onChange={e => setFormData({ ...formData, email: e.target.value })}
//               className={theme.input.withIcon}
//               required
//               disabled={loginMutation.isPending}
//             />
//           </div>

//           <div className={theme.input.wrapper}>
//             <Lock className={theme.input.iconLeft} />
//             <input
//               type={showPassword ? 'text' : 'password'}
//               placeholder="Password"
//               value={formData.password}
//               onChange={e => setFormData({ ...formData, password: e.target.value })}
//               className={theme.input.withIconRight}
//               required
//               disabled={loginMutation.isPending}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(p => !p)}
//               className={theme.input.iconRight}
//               disabled={loginMutation.isPending}
//             >
//               {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//             </button>
//           </div>

//           <div className="flex justify-end -mt-2">
//             <button type="button" className={`${theme.type.link} text-sm`}>
//               Forgot your password?
//             </button>
//           </div>

//           <button
//             type="submit"
//             disabled={loginMutation.isPending}
//             className={`${theme.button.primary} ${theme.button.full} mt-2`}
//           >
//             {loginMutation.isPending
//               ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
//               : 'Login'}
//           </button>
//         </form>

//         <p className={`${theme.type.bodySm} text-center mt-8`}>
//           Don't have an account?{' '}
//           <Link to="/signup" className={theme.type.link}>Sign Up</Link>
//         </p>
//       </div>

//       {/* ── Right: Logo panel ── */}
//       <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden
//                       bg-[#f0ebe0] items-center justify-center">

//         {/* Big semicircle from the right edge */}
//         <div
//           className="absolute"
//           style={{
//             right: '-220px',
//             top: '50%',
//             transform: 'translateY(-50%)',
//             width: '680px',
//             height: '680px',
//             borderRadius: '50%',
//             background: 'radial-gradient(circle, #c5a880 0%, #b8976e 60%, #a07850 100%)',
//           }}
//         />

//         {/* Logo centred on the circle */}
//         <div className="relative z-10 flex items-center justify-center"
//              style={{ marginRight: '-110px' }}>
//           <img
//             src={logo}
//             alt="SecureWatch"
//             className="rounded-full object-cover shadow-2xl"
//             style={{
//               width: '220px',
//               height: '220px',
//               border: '6px solid rgba(255,255,255,0.6)',
//               boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
//             }}
//           />
//         </div>
//       </div>

//     </div>
//   );
// };

// export default Login;

// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useLogin } from '../hooks/useAuth';
import { theme } from '../theme';
import logo from '../assets/logo.jpeg';

const Login = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await loginMutation.mutateAsync(formData);
      if (result.success) navigate('/welcome');
      else setError(result.message || 'Login failed');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex">

      {/* ── Left: Form panel ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-10 sm:px-24 py-12">

        {/* Heading — centred at top of form */}
        <div className="text-center mb-10">
          <h1 className={`${theme.type.h1} mb-2`}>Welcome back.</h1>
          <p className={theme.type.body}>Sign in to your SecureWatch account</p>
        </div>

        {error && <div className={`${theme.alert.error} mb-6`}>{error}</div>}

        <form onSubmit={handleSubmit} className={theme.form.section}>

          <div className={theme.input.wrapper}>
            <Mail className={theme.input.iconLeft} />
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className={theme.input.withIcon}
              required
              disabled={loginMutation.isPending}
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
              disabled={loginMutation.isPending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className={theme.input.iconRight}
              disabled={loginMutation.isPending}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

         

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className={`${theme.button.primary} ${theme.button.full} mt-2`}
          >
            {loginMutation.isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              : 'Login'}
          </button>
        </form>

        <p className={`${theme.type.bodySm} text-center mt-8`}>
          Don't have an account?{' '}
          <Link to="/signup" className={theme.type.link}>Sign Up</Link>
        </p>
      </div>

      {/* ── Right: Semicircle + Logo ── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-[#f0ebe0]">

        {/* Semicircle — large circle, right half visible, vertically centred */}
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

        {/* Logo — perfectly centred on the visible left half of the circle */}
        <div
          style={{
            position:  'absolute',
            right:     '0px',          // left edge of circle = right - 300 + 350 = 50px from panel right
            top:       '50%',
            transform: 'translate(-300px, -50%)', // 300px = radius - 50px to sit on circle centre
            zIndex:    10,
          }}
        >
          <img
            src={logo}
            alt="SecureWatch"
            style={{
              width:     '200px',
              height:    '200px',
              borderRadius: '50%',
              objectFit: 'cover',
              border:    '6px solid rgba(255,255,255,0.75)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.22)',
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default Login;