import React, { useContext, useEffect, useState } from 'react'
import style from './Login.module.css'
import { useFormik } from 'formik'
import axios from 'axios'
import { object, ref, string } from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext.jsx'
import { PulseLoader } from 'react-spinners'

export default function Login() {

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  let { setUserToken } = useContext(UserContext)

  const navigate = useNavigate();

  async function login(values) {
    setLoading(true);
    const { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signin`, values)
      .catch((error) => {
        setLoading(false)
        const { message } = error.response.data;
        setApiError(message)
      })

    if (data.message == "success") {
      localStorage.setItem('userToken', data.token)
      setUserToken(data.token)
      setLoading(false);
      navigate('/');
    }
  }



  const validationSchema = object({
    email: string().required("Email is required").matches(/[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail)\.com\b/, "Invalid Email for Ex: ososmeedo@gmail.com"),
    password: string().required("Password is required").matches(/^\S{8,}$/, "Minimum Password Length is 8")
  })


  const formik = useFormik({
    initialValues: {
      name: "",
      email: ""
    }, validationSchema,
    onSubmit: login

  })

  useEffect(() => {
    document.body.style.backgroundColor = '#488855';

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
          <input type="email" id='email' onChange={formik.handleChange} onBlur={formik.handleBlur} name='email' className={`${style.formControl} form-control mt-2`} />
          {formik.errors.email && formik.touched.email ? <div className='text-danger'>{formik.errors.email}</div> : null}

          <label htmlFor="password" className='fs-5 mt-3'>Password</label>
          <input type="password" id='password' onChange={formik.handleChange} onBlur={formik.handleBlur} name='password' className={`${style.formControl} form-control mt-2`} />
          {formik.errors.password && formik.touched.password ? <div className='text-danger'>{formik.errors.password}</div> : null}

          <div className="submitBtn text-center mt-4">
            {loading ? <PulseLoader color="#63AF18" size={15} /> : <button className="btn btn-success w-50" disabled={!(formik.dirty && formik.isValid)} type='submit'>Login</button>
            }
          </div>
        </form>

        <div className="links d-flex justify-content-between pt-3">
          <Link className='text-decoration-underline text-primary' to={'/forgotpassword'}>Forgot your password</Link>
          <Link to={'/register'}>Don't Have Acoount ?</Link>
        </div>

      </div>
    </div>
  </>
}
