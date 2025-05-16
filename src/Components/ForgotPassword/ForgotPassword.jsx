import React, { useEffect, useState } from 'react'
import style from './ForgotPassword.module.css'
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { object, string } from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(false);
  
    const navigate = useNavigate();
  
    async function forgotPassword(values) {
      setLoading(true);
      const { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords`, values)
        .catch((error) => {
          setLoading(false)
          const { message } = error.response.data;
          toast.error(`${message}`);
        })
  
      if (data.statusMsg == "success") {
        setLoading(false);
        navigate('/verifycode');
      }
    }
  
    const validationSchema = object({
      email: string().required("Email is required").matches(/[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail)\.com\b/, "Invalid Email for Ex: ososmeedo@gmail.com")
    })
  
  
    const formik = useFormik({
      initialValues: {
        email: ""
      }, validationSchema,
      onSubmit: forgotPassword
  
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
  
            <div className="submitBtn text-center mt-4">
              {loading ? <PulseLoader color="#63AF18" size={15}/> : <button className="btn btn-success w-50" disabled={!(formik.dirty && formik.isValid)} type='submit'>Submit</button>
              }
            </div>
          </form>
  
        </div>
      </div>
    </>
}
