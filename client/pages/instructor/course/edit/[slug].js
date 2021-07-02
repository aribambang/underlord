import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import CourseCreateForm from '../../../../components/forms/CourseCreateForm';
import UpdateLessonForm from '../../../../components/forms/UpdateLessonForm';
import Resizer from 'react-image-file-resizer';
import { useRouter } from 'next/router';
import { List, Avatar, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const CourseEdit = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '9.99',
    uploading: false,
    paid: true,
    category: '',
    loading: false,
    lessons: [],
  });

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    const loadCourse = async () => {
      const { data } = await axios.get(`/api/course/${slug}`);
      if (data) setValues(data);
      if (data && data.image) setImage(data.image);
    };
    loadCourse();
  }, [slug]);

  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');
  const [uploadButtonText, setUploadButtonText] = useState('Upload Image');
  const [uploadVideoButtonText, setUploadVideoButtonText] = useState('Upload Video');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({});

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    console.log(file);
    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });

    Resizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async (uri) => {
      try {
        let { data } = await axios.post('/api/course/upload-image', {
          image: uri,
        });
        console.log(data);
        setImage(data);
        setValues({ ...values, loading: false });
      } catch (err) {
        console.log(err);
        setValues({ ...values, loading: false });
        toast('Image upload failed. Try later');
      }
    });
  };

  const handleImageRemove = async () => {
    try {
      setValues({ ...values, loading: true });
      const res = await axios.post('/api/course/remove-image', { image });
      setImage({});
      setPreview('');
      setUploadButtonText('Upload Image');
      setValues({ ...values, loading: false });
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
      toast('Remove image failed. Try later');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/course/${slug}`, { ...values, image });
      toast('Course has been updated.');
      router.push('/instructor');
    } catch (err) {
      console.log(err);
      toast(err.response.data.message);
    }
  };

  const handleDrag = (e, index) => {
    e.dataTransfer.setData('itemIndex', index);
  };

  const handleDrop = async (e, index) => {
    const movingItemIndex = e.dataTransfer.getData('itemIndex');
    const targetItemIndex = index;
    let allLessons = values.lessons;

    let movingItem = allLessons[movingItemIndex];
    allLessons.splice(movingItemIndex, 1);
    allLessons.splice(targetItemIndex, 0, movingItem);

    setValues({ ...values, lessons: [...allLessons] });

    const { data } = await axios.put(`/api/course/${slug}`, { ...values, image });
    toast('Lessons rearranged successfully');
  };

  const handleDeleteLesson = async (index) => {
    const answer = window.confirm('Are you sure you want to delete?');
    if (!answer) return;

    try {
      let allLessons = values.lessons;
      const removed = allLessons.splice(index, 1);
      const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`);
      if (data.ok) {
        setValues({ ...values, lessons: [...allLessons] });
        toast('Delete lesson success');
      }
    } catch (err) {
      toast('Delete lesson failed');
    }
  };

  const handleVideo = async (e) => {
    try {
      if (current.video && current.video.Location) {
        const res = await axios.post(
          `/api/course/video-remove/${values.instructor._id}`,
          current.video,
        );
      }

      const file = e.target.files[0];
      setUploadVideoButtonText(file.name);
      setUploading(true);

      const videoData = new FormData();
      videoData.append('video', file);
      videoData.append('courseId', values._id);
      const { data } = await axios.post(
        `/api/course/video-upload/${values.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            console.log(e.loaded);
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        },
      );

      setCurrent({ ...current, video: data });

      const updatedLesson = await axios.put(`/api/course/lesson/${slug}/${current._id}`, current);
      if (updatedLesson.data.ok) {
        let arr = values.lessons;
        const index = arr.findIndex((el) => el._id === current._id);
        arr[index] = current;
        setValues({ ...values, lessons: arr });
        toast('Lesson video updated');
      }
      setUploading(false);
    } catch (err) {
      toast(err.response.data.message);
    }
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(`/api/course/lesson/${slug}/${current._id}`, current);
      if (data.ok) {
        let arr = values.lessons;
        const index = arr.findIndex((el) => el._id === current._id);
        arr[index] = current;
        setValues({ ...values, lessons: arr });
        toast('Lesson updated');

        setCurrent({});
        setUploadVideoButtonText('Upload Video');
        setProgress(0);
        setUploading(false);
        setVisible(false);
      }
    } catch (err) {
      toast(err.response.data.message);
    }
  };

  return (
    <InstructorRoute>
      <h1 className='jumbotron text-center square'>Update Course</h1>
      <div className='pt-3 pb-3'>
        <CourseCreateForm
          handleChange={handleChange}
          handleImage={handleImage}
          handleImageRemove={handleImageRemove}
          handleSubmit={handleSubmit}
          setValues={setValues}
          values={values}
          preview={preview}
          uploadButtonText={uploadButtonText}
          editPage={true}
        />
      </div>

      <hr />
      <div className='row pb-5'>
        <div className='col lesson-list'>
          <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
          <List
            onDragOver={(e) => e.preventDefault()}
            itemLayout='horizontal'
            dataSource={values && values.lessons}
            renderItem={(item, index) => (
              <List.Item
                draggable
                onDragStart={(e) => handleDrag(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <List.Item.Meta
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                ></List.Item.Meta>
                <EditOutlined
                  onClick={() => {
                    setVisible(true);
                    setCurrent(item);
                  }}
                  className='text-warning me-3'
                />
                <DeleteOutlined onClick={() => handleDeleteLesson(index)} className='text-danger' />
              </List.Item>
            )}
          />
        </div>
      </div>
      <Modal
        title='Update lesson'
        centered
        visible={visible}
        onCancel={() => {
          setCurrent({});
          setUploadVideoButtonText('Upload Video');
          setProgress(0);
          setUploading(false);
          setVisible(false);
        }}
        footer={null}
      >
        <UpdateLessonForm
          current={current}
          setCurrent={setCurrent}
          handleVideo={handleVideo}
          handleUpdateLesson={handleUpdateLesson}
          uploadVideoButtonText={uploadVideoButtonText}
          progress={progress}
          uploading={uploading}
        />
      </Modal>
    </InstructorRoute>
  );
};

export default CourseEdit;
