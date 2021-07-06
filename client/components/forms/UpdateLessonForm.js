import React from 'react';
import { Button, Progress, Switch } from 'antd';
import ReactPlayer from 'react-player';

const UpdateLessonForm = ({
  handleUpdateLesson,
  setCurrent,
  current,
  uploading,
  uploadVideoButtonText,
  handleVideo,
  progress,
}) => {
  return (
    <div className='container pt-3'>
      <form onSubmit={handleUpdateLesson}>
        <input
          name='title'
          type='text'
          className='form-control square'
          onChange={(e) => setCurrent({ ...current, title: e.target.value })}
          value={current.title}
          placeholder='Title'
          autoFocus
          required
        />
        <textarea
          name='content'
          className='form-control mt-3'
          cols='7'
          rows='7'
          onChange={(e) => setCurrent({ ...current, content: e.target.value })}
          value={current.content}
          placeholder='Content'
        ></textarea>
        <div>
          {!uploading && current.video && current.video.Location && (
            <div className='pt-2 d-flex justify-content-center'>
              <ReactPlayer url={current.video.Location} width='410px' height='240px' controls />
            </div>
          )}
          <div className='flex-grow-1 me-1'>
            <div className='d-grid gap-2'>
              <label className='btn btn-dark text-start mt-3'>
                {uploadVideoButtonText}
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
        </div>

        {progress > 0 && (
          <Progress className='d-flex justify-content-center pt-2' percent={progress} steps={10} />
        )}

        <div className='d-flex justify-content-between pt-2'>
          <span className='pt-3 badge text-dark'>Preview</span>
          <Switch
            className='float-right mt-2'
            disabled={uploading}
            checked={current.free_preview}
            defaultChecked={false}
            name='free_preview'
            onChange={(v) => setCurrent({ ...current, free_preview: v })}
          />
        </div>
        <div className='d-grid gap-2'>
          <Button
            onClick={handleUpdateLesson}
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

export default UpdateLessonForm;
