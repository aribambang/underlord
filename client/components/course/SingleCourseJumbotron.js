import React, { useRef, useEffect } from 'react';
import { Badge, Modal, Button } from 'antd';
import { currencyFormatter } from '../../utils/helpers';
import moment from 'moment';
import ReactPlayer from 'react-player';
import { LoadingOutlined, SafetyOutlined } from '@ant-design/icons';

const SingleCourseJumbotron = ({
  course,
  showModal,
  setShowModal,
  preview,
  setPreview,
  loading,
  handlePaidEnrollment,
  handleFreeEnrollment,
  user,
  enrolled,
  setEnrolled,
}) => {
  const { name, description, instructor, updatedAt, lessons, image, price, paid, category } =
    course;
  const playerRef = useRef(null);

  useEffect(() => {
    playerRef.current.showPreview();
  }, [showModal]);

  return (
    <div className='jumbotron bg-primary square'>
      <div className='row'>
        <div className='col-md-8'>
          <h1 className='text-light font-weight-bold'>{name}</h1>
          <p className='lead'>{description && description.substring(0, 160)}...</p>
          <Badge count={category} className='pb-4 me-2' style={{ backgroundColor: '#03a9f4' }} />
          <p>Create by {instructor.name}</p>
          <p>Last updated {moment(updatedAt).format('MM/YYYY')}</p>
          <h4 className='text-light'>
            {paid ? currencyFormatter({ amount: price, currency: 'idr' }) : 'Free'}
          </h4>
        </div>
        <div className='col-md-4'>
          {lessons[0].video && lessons[0].video.Location && lessons[0].free_preview ? (
            <div
              onClick={() => {
                setPreview(lessons[0].video.Location);
                setShowModal(!showModal);
              }}
            >
              <ReactPlayer
                className='react-player-div'
                url={lessons[0].video.Location}
                light={image.Location}
                width='100%'
                height='225px'
                ref={playerRef}
              />
            </div>
          ) : (
            <>
              <img
                src={image.Location}
                alt={name}
                style={{ height: '225px' }}
                className='img img-fluid'
              />
            </>
          )}
          {loading ? (
            <div className='d-flex justify-content-center'>
              <LoadingOutlined className='h1 text-danger' />
            </div>
          ) : (
            <Button
              className='mb-3 mt-3'
              type='danger'
              block
              shape='round'
              icon={<SafetyOutlined />}
              size='large'
              disabled={loading}
              onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}
            >
              {user ? (enrolled.status ? 'Go to course' : 'Enroll') : 'Login to Enroll'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleCourseJumbotron;
