import React, { useState, useEffect } from 'react';
import { Select, Button, Image, Badge } from 'antd';

const CourseCreateForm = ({
  handleChange,
  handleImage,
  handleSubmit,
  values,
  setValues,
  preview,
  uploadButtonText,
  handleImageRemove,
}) => {
  const { Option } = Select;
  const children = [];

  for (let i = 9.99; i <= 100.99; i++) {
    children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='mb-3'>
        <input
          type='text'
          name='name'
          className='form-control'
          placeholder='Name'
          value={values.name}
          onChange={handleChange}
        />
      </div>
      <div className='mb-3'>
        <textarea
          name='description'
          cols='7'
          rows='7'
          value={values.description}
          className='form-control'
          onChange={handleChange}
          placeholder='Description'
        ></textarea>
      </div>

      <div className='row mb-3'>
        <div className='col'>
          <div className='form-group'>
            <Select
              style={{ width: '100%' }}
              size='large'
              value={values.paid}
              onChange={(v) => setValues({ ...values, paid: v, price: 0 })}
            >
              <Option value={true}>Paid</Option>
              <Option value={false}>Free</Option>
            </Select>
          </div>
        </div>
        {values.paid && (
          <div className='col'>
            <div className='form-group'>
              <Select
                defaultValue='$9.99'
                style={{ width: '100%' }}
                size='large'
                tokenSeparators={[,]}
                onChange={(v) => setValues({ ...values, price: v })}
              >
                {children}
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className='mb-3'>
        <input
          type='text'
          name='category'
          className='form-control'
          placeholder='Category'
          value={values.category}
          onChange={handleChange}
        />
      </div>

      {preview && (
        <div className='mb-3'>
          <Badge count='x' style={{ cursor: 'pointer' }} onClick={handleImageRemove}>
            <Image width={200} height={200} src={preview} />
          </Badge>
        </div>
      )}
      <div className='row'>
        <div className='col'>
          <div className='mb-3 d-grid gap-2'>
            <label className='btn btn-outline-secondary text-start'>
              {uploadButtonText}
              <input
                type='file'
                name='image'
                onChange={handleImage}
                onClick={(e) => (e.target.value = null)}
                accept='image/*'
                hidden
              />
            </label>
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <Button
            onClick={handleSubmit}
            disabled={values.loading || values.uploading}
            className='btn btn-primary'
            loading={values.loading}
            type='primary'
            size='large'
            shape='round'
          >
            {values.loading ? 'Savings...' : 'Save & Continue'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CourseCreateForm;
