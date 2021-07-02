import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Tooltip } from 'antd';
import Link from 'next/link';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import InstructorRoute from '../../components/routes/InstructorRoute';

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      const { data } = await axios.get('/api/instructor-courses');
      setCourses(data);
    };
    loadCourses();
  }, []);
  return (
    <InstructorRoute>
      <h1 className='jumbotron text-center square'>Instructor Dashboard</h1>
      {courses &&
        courses.map((course, index) => (
          <div key={index}>
            <div className='d-flex'>
              <div className='flex-shrink-0'>
                <Avatar size={70} src={course.image ? course.image.Location : '/course.png'} />
              </div>
              <div className='flex-grow-1 ms-3'>
                <div className='row'>
                  <div className='col'>
                    <Link href={`/instructor/course/view/${course.slug}`} className='pointer'>
                      <a className='mt-2 text-primary'>
                        <h5 className='pt-2'>{course.name}</h5>
                      </a>
                    </Link>
                    <p style={{ marginTop: '-10px' }}>{course.lessons.length} Lessons</p>

                    {course.lessons.length < 5 ? (
                      <p style={{ marginTop: '-15px', fontSize: '10px' }} className='text-warning'>
                        At least 5 lessons are required to publish a course
                      </p>
                    ) : course.published ? (
                      <p style={{ marginTop: '-15px', fontSize: '10px' }} className='text-success'>
                        Your course is live in the marketplace
                      </p>
                    ) : (
                      <p style={{ marginTop: '-15px', fontSize: '10px' }} className='text-success'>
                        Your course is ready to be published
                      </p>
                    )}
                  </div>
                  <div className='col-md-3 mt-3 text-center'>
                    {course.published ? (
                      <Tooltip title='Published'>
                        <CheckCircleOutlined className='h5 pointer text-success' />
                      </Tooltip>
                    ) : (
                      <Tooltip title='Unpublished'>
                        <CloseCircleOutlined className='h5 pointer text-warning' />
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </InstructorRoute>
  );
};

export default InstructorIndex;
