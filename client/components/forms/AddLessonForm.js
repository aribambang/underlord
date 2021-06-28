import React from 'react';
import { Button, Progress, Tooltip } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';

const AddLessonForm = ({
  handleAddLesson,
  setValues,
  values,
  uploading,
  uploadButtonText,
  handleVideo,
  progress,
  handleVideoRemove,
}) => {
  return (
    <div className='container pt-3'>
      <form onSubmit={handleAddLesson}>
        <input
          name='title'
          type='text'
          className='form-control square'
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          value={values.title}
          placeholder='Title'
          autoFocus
          required
        />
        <textarea
          name='content'
          className='form-control mt-3'
          cols='7'
          rows='7'
          onChange={(e) => setValues({ ...values, content: e.target.value })}
          value={values.content}
          placeholder='Content'
        ></textarea>
        <div className='d-flex'>
          <div className='flex-grow-1 me-1'>
            <div class='d-grid gap-2'>
              <label className='btn btn-dark text-start mt-3'>
                {uploadButtonText}
                <input
                  name='video'
                  type='file'
                  accept='video/*'
                  onChange={handleVideo}
                  onClick={(e) => (e.target.value = null)}
                  hidden
                />
              </label>
            </div>
          </div>
          {!uploading && values.video.Location && (
            <Tooltip title='remove'>
              <span onClick={handleVideoRemove} className='pt-1 pl-3'>
                <CloseCircleFilled
                  className='text-danger d-flex justify-content-center pt-4'
                  style={{ cursor: 'pointer' }}
                />
              </span>
            </Tooltip>
          )}
        </div>

        {progress > 0 && (
          <Progress className='d-flex justify-content-center pt-2' percent={progress} steps={10} />
        )}
        <div className='d-grid gap-2'>
          <Button
            onClick={handleAddLesson}
            className='col mt-3'
            size='large'
            type='primary'
            loading={uploading}
            shape='round'
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddLessonForm;
