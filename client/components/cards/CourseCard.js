import React from 'react';
import { Badge, Card } from 'antd';
import Link from 'next/link';
import { currencyFormatter } from '../../utils/helpers';

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
          <h3 className='font-weight-bold'>{name}</h3>
          <p>by {instructor.name}</p>
          <Badge count={category} style={{ backgroundColor: '#03a94f4' }} className='pb-2 mr-2' />
          <h5>{paid ? currencyFormatter({ amount: price, currency: 'idr' }) : 'Free'}</h5>
        </Card>
      </a>
    </Link>
  );
};

export default CourseCard;
