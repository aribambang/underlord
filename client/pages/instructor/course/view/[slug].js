import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import axios from 'axios';
import { Image, Tooltip, Modal, Button, List, Avatar } from 'antd';
import {
  EditOutlined,
  CheckOutlined,
  UploadOutlined,
  QuestionOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import AddLessonForm from '../../../../components/forms/AddLessonForm';
import { toast } from 'react-toastify';

const CourseView = () => {
  const [course, setCourse] = useState({});
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    title: '',
    content: '',
    video: {},
  });

  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState('Upload Video');
  const [progress, setProgress] = useState(0);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    const loadCourse = async () => {
      const { data } = await axios.get(`/api/course/instructor/${slug}`);
      console.log(data);
      setCourse(data);
    };
    if (slug) loadCourse();
  }, [slug]);

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor._id}`,
        values,
      );

      setValues({ ...values, title: '', content: '', video: {} });
      setUploadButtonText('Upload Video');
      setProgress(0);
      setVisible(false);
      setCourse(data);
      toast('Lesson has been uploaded');
    } catch (err) {
      console.log(err);
      toast(err);
    }
  };

  const handleVideo = async (e) => {
    try {
      const file = e.target.files[0];
      setUploadButtonText(file.name);
      setUploading(true);

      const formData = new FormData();

      formData.append('video', file);
      const { data } = await axios.post(
        `/api/course/video-upload/${course.instructor._id}`,
        formData,
        {
          onUploadProgress: (e) => {
            console.log(e.loaded);
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        },
      );
      console.log(data);
      setValues({ ...values, video: data });
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast(err);
    }
  };

  const handleVideoRemove = async (e) => {
    try {
      setUploading(true);
      const { data } = await axios.post(
        `/api/course/video-remove/${course.instructor._id}`,
        values.video,
      );
      console.log(data);
      setValues({ ...values, video: {} });
      setUploading(false);
      setProgress(0);
      setUploadButtonText('Upload Video');
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast(err);
    }
  };

  const handlePublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        'Once you publish your course, it will be live in the marketplace for users to enroll',
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/publish/${courseId}`);
      setCourse(data);
      toast('Congrats! Your course is live');
    } catch (err) {
      toast(err.response.data);
    }
  };

  const handleUnpublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        'Once you unpublish your course, it will be no available for users to enroll',
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
      setCourse(data);
      toast('Your course is unpublished');
    } catch (err) {
      toast(err.response.data);
    }
  };

  return (
    <InstructorRoute>
      <div className='container-fluid pt-3'>
        {course && (
          <div className='container-fluid pt-1'>
            <div className='d-flex pt-2'>
              <div className='flex-grow-1 ms-3'>
                <div className='row'>
                  <Image width={80} src={course.image ? course.image.Location : '/course.png'} />
                  <div className='col'>
                    <h5 className='mt-2 text-primary'>{course.name}</h5>
                    <p style={{ marginTop: '-10px' }}>
                      {course.lessons && course.lessons.length} lessons
                    </p>
                    <p style={{ marginTop: '-15px', fontSize: '10px' }}>{course.category}</p>
                  </div>
                  <div className='col-md-1 d-flex justify-content-end pt-4'>
                    <Tooltip title='Edit'>
                      <EditOutlined
                        onClick={() => router.push(`/instructor/course/edit/${slug}`)}
                        className='h5 text-warning me-4'
                      />
                    </Tooltip>
                    {course.lessons && course.lessons.length < 5 ? (
                      <Tooltip title='Min 5 lessons required to publish'>
                        <QuestionOutlined className='h5 pointer text-danger' />
                      </Tooltip>
                    ) : course.published ? (
                      <Tooltip title='Unpublish'>
                        <CloseOutlined
                          onClick={(e) => handleUnpublish(e, course._id)}
                          className='h5 pointer text-danger'
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title='Publish'>
                        <CheckOutlined
                          onClick={(e) => handlePublish(e, course._id)}
                          className='h5 pointer text-success'
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
                <hr />
                <div className='row'>
                  <div className='col'>
                    <ReactMarkdown children={course.description} />
                  </div>
                </div>
                <div className='row'>
                  <Button
                    onClick={() => setVisible(true)}
                    className='col-md-6 offset-md-3 text-center'
                    type='primary'
                    shape='round'
                    icon={<UploadOutlined />}
                    size='large'
                  >
                    Add Lesson
                  </Button>
                  <br />
                  <Modal
                    title='+ Add lesson'
                    centered
                    visible={visible}
                    onCancel={() => setVisible(false)}
                    footer={null}
                  >
                    <AddLessonForm
                      values={values}
                      setValues={setValues}
                      handleAddLesson={handleAddLesson}
                      uploading={uploading}
                      uploadButtonText={uploadButtonText}
                      handleVideo={handleVideo}
                      progress={progress}
                      handleVideoRemove={handleVideoRemove}
                    />
                  </Modal>

                  <div className='row pb-5'>
                    <div className='col lesson-list'>
                      <h4>{course && course.lessons && course.lessons.length} Lessons</h4>
                      <List
                        itemLayout='horizontal'
                        dataSource={course && course.lessons}
                        renderItem={(item, index) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={<Avatar>{index + 1}</Avatar>}
                              title={item.title}
                            ></List.Item.Meta>
                          </List.Item>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorRoute>
  );
};

export default CourseView;
