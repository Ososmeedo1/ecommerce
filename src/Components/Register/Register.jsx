import React, { useContext, useEffect, useState } from 'react'
import style from './Register.module.css'
import { useFormik } from 'formik'
import axios from 'axios'
import { object, ref, string } from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { PulseLoader } from 'react-spinners'

export default function Register() {

  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(false)

  const navigate = useNavigate();

  async function register(values) {
    setLoading(true);

    const { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signup`, values)
      .catch((error) => {
        setLoading(false);
        const { message } = error.response.data;
        setApiError(message);
      })

    if (data.message == "success") {
      setLoading(false);
      navigate('/login');
    }
  }

  const validationSchema = object({
    name: string().required("Name is required").min(3, "Min Name Length is 3").max(40, "Max Name Length is 40"),
    email: string().required("Email is required").matches(/[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail)\.com\b/, "Invalid Email for Ex: ososmeedo@gmail.com"),
    password: string().required("Password is required").matches(/^\S{8,}$/, "Minimum Password Length is 8"),
    rePassword: string().required("Re-password is required").oneOf([ref('password')], "Re-password does not match password"),
    phone: string().required("Phone is required").matches(/^01[0125][0-9]{8}$/, "This is not Egyptian number")
  })


  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: ""
    }, validationSchema,
    onSubmit: register

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
        <h2 className='fw-semibold'>Sign Up</h2>
        {apiError ? <div className='alert alert-danger'>{apiError}</div> : null}
        <form className='pt-3' onSubmit={formik.handleSubmit}>
          <label htmlFor="name" className='fs-5'>Name</label>
          <input type="text" id='name' onChange={formik.handleChange} onBlur={formik.handleBlur} name='name' className={`${style.formControl} form-control mt-2`} />
          {formik.errors.name && formik.touched.name ? <div className='text-danger'>{formik.errors.name}</div> : null}

          <label htmlFor="email" className='fs-5 mt-3'>Email</label>
          <input type="email" id='email' onChange={formik.handleChange} onBlur={formik.handleBlur} name='email' className={`${style.formControl} form-control mt-2`} />
          {formik.errors.email && formik.touched.email ? <div className='text-danger'>{formik.errors.email}</div> : null}

          <label htmlFor="password" className='fs-5 mt-3'>Password</label>
          <input type="password" id='password' onChange={formik.handleChange} onBlur={formik.handleBlur} name='password' className={`${style.formControl} form-control mt-2`} />
          {formik.errors.password && formik.touched.password ? <div className='text-danger'>{formik.errors.password}</div> : null}

          <label htmlFor="rePassword" className='fs-5 mt-3'>Re-password</label>
          <input type="password" id='rePassword' onChange={formik.handleChange} onBlur={formik.handleBlur} name='rePassword' className={`${style.formControl} form-control mt-2`} />
          {formik.errors.rePassword && formik.touched.rePassword ? <div className='text-danger'>{formik.errors.rePassword}</div> : null}

          <label htmlFor="phone" className='fs-5 mt-3'>Phone</label>
          <input type="tel" id='phone' onChange={formik.handleChange} onBlur={formik.handleBlur} name='phone' className={`${style.formControl} form-control mt-2`} />
          {formik.errors.phone && formik.touched.phone ? <div className='text-danger'>{formik.errors.phone}</div> : null}

          <div className="submitBtn text-center mt-4">
            {loading ? <PulseLoader color="#63AF18" size={15} /> : <button className="btn btn-success w-50" disabled={!(formik.dirty && formik.isValid)} type='submit'>Sign Up</button>
            }
          </div>
        </form>
        <div className="link pt-3">
          <Link to={'/login'}>Already Have Account ?</Link>
        </div>
      </div>
    </div>
  </>
}
