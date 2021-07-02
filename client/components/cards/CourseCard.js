import React from 'react';
import { Badge, Card } from 'antd';
import Link from 'next/link';

const CourseCard = ({ course }) => {
  const { Meta } = Card;
  const { name, instructor, price, image, slug, paid, category } = course;
  return (
    <Link href={`/course/${slug}`}>
      <a>
        <Card
          className='mb-4'
          cover={
            <img
              src={image.Location}
              alt={name}
              style={{ height: '200px', objectFit: 'cover' }}
              className='p-1'
            />
          }
        >
          <h2 className='font-weight-bold'>{name}</h2>
          <p>by {instructor.name}</p>
          <Badge count={category} style={{ backgroundColor: '#03a94f4' }} className='pb-2 mr-2' />
          <h4 className>{paid ? price : 'Free'}</h4>
        </Card>
      </a>
    </Link>
  );
};

export default CourseCard;
