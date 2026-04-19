import React, { useContext, useEffect, useState } from 'react'
import style from './Login.module.css'
import { useFormik } from 'formik'
import { object, string } from 'yup'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext.jsx'
import { PulseLoader } from 'react-spinners'
import toast from 'react-hot-toast'
import { getFriendlyAuthErrorMessage } from '../../utils/api.js'
import { setPageMeta } from '../../utils/seo.js'
import { trackEvent } from '../../utils/analytics.js'
import { signIn } from '../../services/storeApi.js'

export default function Login() {

  const testAccount = {
    email: 'admin@gmail.com',
    password: 'Admin@123'
  }

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  let { setUserToken } = useContext(UserContext)

  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get('redirect');
  const redirectPath = redirectParam && redirectParam.startsWith('/') ? redirectParam : '/';

  function fillTestAccount() {
    setApiError(false)
    formik.setValues(testAccount)
  }

  async function quickLogin() {
    setApiError(false)
    formik.setValues(testAccount)
    await login(testAccount)
  }

  async function copyCredential(value, label) {
    try {
      await navigator.clipboard.writeText(value)
      toast.success(`${label} copied`)
    } catch {
      toast.error(`Unable to copy ${label.toLowerCase()} right now.`)
    }
  }

  async function login(values) {
    setLoading(true);
    const response = await signIn(values)

    if (response?.message) {
      setLoading(false)
      setApiError(getFriendlyAuthErrorMessage(response))
      return
    }

    const { data } = response

    if (data.message == "success") {
      localStorage.setItem('userToken', data.token)
      setUserToken(data.token)
      trackEvent('login_success', { redirectPath })
      setLoading(false);
      navigate(redirectPath);
    }
  }



  const validationSchema = object({
    email: string().required("Email is required").matches(/[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail)\.com\b/, "Invalid Email for Ex: ososmeedo@gmail.com"),
    password: string().required("Password is required").matches(/^\S{8,}$/, "Minimum Password Length is 8")
  })


  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    }, validationSchema,
    onSubmit: login

  })

  useEffect(() => {
    document.body.style.backgroundColor = '#488855';
    setPageMeta({
      title: 'Login | Fresh Cart',
      description: 'Login to Fresh Cart to manage your cart, wishlist, and checkout.'
    })

    return () => {
      document.body.style.backgroundColor = ''
    }
  }, [])



  return <>

    <div className="container pt-4">
      <div className={`${style.formColor} w-75 mx-auto p-4 rounded-3 shadow bg-white`}>
        <h2 className='fw-semibold'>Login</h2>
        {apiError ? <div className='alert alert-danger'>{apiError}</div> : null}
        <form className='pt-3' onSubmit={formik.handleSubmit}>

          <label htmlFor="email" className='fs-5 mt-3'>Email</label>
          <input type="email" id='email' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} name='email' className={`${style.formControl} form-control mt-2`} />
          {formik.errors.email && formik.touched.email ? <div className='text-danger'>{formik.errors.email}</div> : null}

          <label htmlFor="password" className='fs-5 mt-3'>Password</label>
          <div className={style.passwordWrap}>
            <input type={showPassword ? 'text' : 'password'} id='password' value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} name='password' className={`${style.formControl} form-control mt-2`} />
            <button type='button' className={style.passwordToggle} onClick={() => setShowPassword((prev) => !prev)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
          {formik.errors.password && formik.touched.password ? <div className='text-danger'>{formik.errors.password}</div> : null}

          <div className="submitBtn text-center mt-4">
            {loading ? <PulseLoader color="#63AF18" size={15} /> : <button className="btn btn-success w-50" disabled={!(formik.dirty && formik.isValid)} type='submit'>Login</button>
            }
          </div>
        </form>

        <div className={`${style.dummyCard} mt-4`}>
          <h3 className='h5 fw-semibold mb-2'>Test Account (Already Exists)</h3>
          <p className='mb-2'>This account is already created in the API, so users can login directly without registering.</p>
          <p className='mb-1'><span className='fw-semibold'>Email:</span> {testAccount.email} <button type='button' className={style.copyBtn} onClick={() => copyCredential(testAccount.email, 'Email')}>Copy</button></p>
          <p className='mb-3'><span className='fw-semibold'>Password:</span> {testAccount.password} <button type='button' className={style.copyBtn} onClick={() => copyCredential(testAccount.password, 'Password')}>Copy</button></p>
          <button type='button' className='btn btn-success' onClick={quickLogin} disabled={loading}>Quick Login (Employer Test)</button>
        </div>

        <div className="links d-flex justify-content-between pt-3">
          <Link className='text-decoration-underline text-primary' to={'/forgotpassword'}>Forgot your password</Link>
          <Link to={'/register'}>Don't Have Account ?</Link>
        </div>

      </div>
    </div>
  </>
}
