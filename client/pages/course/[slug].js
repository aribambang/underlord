import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import SingleCourseJumbotron from '../../components/course/SingleCourseJumbotron';
import SingleCourseLessons from '../../components/course/SingleCourseLessons';
import PreviewModal from '../../components/modal/PreviewModal';
import { Context } from '../../context';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';

const SingleCourse = ({ course }) => {
  const router = useRouter();
  const { slug } = router.query;
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState({});
  const {
    state: { user },
  } = useContext(Context);

  useEffect(() => {
    if (user && course) checkEnrollment();
  }, [user, course]);

  const checkEnrollment = async () => {
    const { data } = await axios.get(`/api/check-enrollment/${course._id}`);
    console.log(data);
    setEnrolled(data);
  };

  const handlePaidEnrollment = async () => {
    try {
      if (!user) return router.push('/login');
      if (enrolled.status) return router.push(`/user/course/${slug}`);
      setLoading(true);

      const { data } = await axios.post(`/api/paid-enrollment/${course._id}`);
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
      stripe.redirectToCheckout({ sessionId: data });
    } catch (err) {
      console.log(err);
      toast(err.response.data.message);
      setLoading(false);
    }
  };

  const handleFreeEnrollment = async (e) => {
    e.preventDefault();
    try {
      if (!user) return router.push('/login');
      if (enrolled.status) return router.push(`/user/course/${slug}`);
      setLoading(true);
      const { data } = await axios.post(`/api/free-enrollment/${course._id}`);
      toast(data.message);
      setLoading(false);
      router.push(`/user/course/${slug}`);
    } catch (err) {
      console.log(err);
      toast(err.response.data.message);
      setLoading(false);
    }
  };

  return (
    <>
      <SingleCourseJumbotron
        course={course}
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
        setPreview={setPreview}
        user={user}
        loading={loading}
        handleFreeEnrollment={handleFreeEnrollment}
        handlePaidEnrollment={handlePaidEnrollment}
        enrolled={enrolled}
        setEnrolled={setEnrolled}
      />
      <PreviewModal showModal={showModal} setShowModal={setShowModal} preview={preview} />
      {course.lessons && (
        <SingleCourseLessons
          lessons={course.lessons}
          showModal={showModal}
          setShowModal={setShowModal}
          setPreview={setPreview}
        />
      )}
    </>
  );
};

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(`${process.env.API}/course/${query.slug}`);
  return {
    props: {
      course: data,
    },
  };
}

export default SingleCourse;
