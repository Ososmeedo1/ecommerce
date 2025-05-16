import React, { useContext, useEffect, useState } from 'react'
import style from './ResetPassword.module.css'
import { useFormik } from 'formik';
import { object, ref, string } from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';

export default function ResetPassword() {

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  let { setUserToken } = useContext(UserContext)

  const navigate = useNavigate();

  async function resetPassword(values) {

    setLoading(true);
    const { data } = await axios.put(`https://ecommerce.routemisr.com/api/v1/auth/resetPassword`, values)
      .catch((error) => {
        setLoading(false)
        const { message } = error.response.data;
        setApiError(message)
      })

      console.log(data);


    if (data.token) {
      setUserToken(data.token)
      localStorage.setItem('userToken', data.token)
      setLoading(false);
      navigate('/login');
    }
  }

  const validationSchema = object({
    email: string().required("Email is required").matches(/[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail)\.com\b/, "Invalid Email for Ex: ososmeedo@gmail.com"),
    newPassword: string().required("Password is required").matches(/^\S{8,}$/, "Minimum Password Length is 8"),
    rePassword: string().required("Re-password is required").oneOf([ref('newPassword')], "Re-password does not match password")
  })


  const formik = useFormik({
    initialValues: {
      email: "",
      newPassword: "",
      rePassword: ""
    }, validationSchema,
    onSubmit: resetPassword

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
        <h2 className='fw-semibold'>Reset Password</h2>
        {apiError ? <div className='alert alert-danger'>{apiError}</div> : null}
        <form className='pt-3' onSubmit={formik.handleSubmit}>

          <label htmlFor="email" className='fs-5 mt-3'>Email</label>
          <input type="email" id='email' onChange={formik.handleChange} onBlur={formik.handleBlur} name='email' className={`${style.formControl} form-control mt-2`} />
          {formik.errors.email && formik.touched.email ? <div className='text-danger'>{formik.errors.email}</div> : null}

          <label htmlFor="newPassword" className='fs-5 mt-3'>New Password</label>
          <input type="password" id='newPassword' onChange={formik.handleChange} onBlur={formik.handleBlur} name='newPassword' className={`${style.formControl} form-control mt-2`} />
          {formik.errors.newPassword && formik.touched.newPassword ? <div className='text-danger'>{formik.errors.newPassword}</div> : null}

          <label htmlFor="rePassword" className='fs-5 mt-3'>Re-password</label>
          <input type="password" id='rePassword' onChange={formik.handleChange} onBlur={formik.handleBlur} name='rePassword' className={`${style.formControl} form-control mt-2`} />
          {formik.errors.rePassword && formik.touched.rePassword ? <div className='text-danger'>{formik.errors.rePassword}</div> : null}
          <div className="submitBtn text-center mt-4">
            {loading ? <PulseLoader color="#63AF18" size={15} /> : <button className="btn btn-success w-50" disabled={!(formik.dirty && formik.isValid)} type='submit'>Submit</button>
            }
          </div>
        </form>
      </div>
    </div>
  </>
}
