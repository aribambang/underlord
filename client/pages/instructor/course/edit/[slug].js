import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import CourseCreateForm from '../../../../components/forms/CourseCreateForm';
import Resizer from 'react-image-file-resizer';
import { useRouter } from 'next/router';
import { List, Avatar } from 'antd';

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
              </List.Item>
            )}
          />
        </div>
      </div>
    </InstructorRoute>
  );
};

export default CourseEdit;
