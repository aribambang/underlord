const AWS = require('aws-sdk');
const { nanoid } = require('nanoid');
const Course = require('../models/course');
const slugify = require('slugify');
const { readFileSync } = require('fs');

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: 'Image required' });

    const base64data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    const type = image.split(';')[0].split('/')[1];

    const params = {
      Bucket: 'fundemy-bucket',
      Key: `${nanoid()}.${type}`,
      Body: base64data,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: `image/${type}`,
    };

    S3.upload(params, (err, data) => {
      if (err) return res.sendStatus(400);
      console.log(data);
      res.json(data);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const removeImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: 'Image required' });

    const params = {
      Bucket: image.Bucket,
      Key: image.Key,
    };

    S3.deleteObject(params, (err, data) => {
      if (err) return res.sendStatus(400);
      return res.json({ ok: true });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const create = async (req, res) => {
  try {
    const alreadyExist = await Course.findOne({ slug: slugify(req.body.name.toLowerCase()) });
    if (alreadyExist) return res.status(400).json({ message: 'Name course already taken' });

    const course = await Course({
      slug: slugify(req.body.name),
      instructor: req.user._id,
      ...req.body,
    }).save();

    res.json(course);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const detail = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('instructor', '_id name')
      .exec();
    return res.json(course);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const videoUpload = async (req, res) => {
  try {
    if (req.user._id !== req.params.instructorId)
      return res.status(400).json({ message: 'Unauthorized' });

    const { video } = req.files;

    if (!video) return res.status(400).json({ message: 'Video is required' });

    const params = {
      Bucket: 'fundemy-bucket',
      Key: `${nanoid()}.${video.type.split('/')[1]}`,
      Body: readFileSync(video.path),
      ACL: 'public-read',
      ContentType: video.type,
    };

    S3.upload(params, (err, data) => {
      if (err) return res.sendStatus(400);
      return res.json(data);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const videoRemove = async (req, res) => {
  try {
    if (req.user._id !== req.params.instructorId)
      return res.status(400).json({ message: 'Unauthorized' });
    const { Bucket, Key } = req.body;

    S3.deleteObject({ Bucket, Key }, (err, data) => {
      if (err) return res.sendStatus(400);
      return res.json({ ok: true });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const addLesson = async (req, res) => {
  try {
    const { slug, instructorId } = req.params;
    const { title, content, video } = req.body;

    if (req.user._id !== req.params.instructorId)
      return res.status(400).json({ message: 'Unauthorized' });

    const updated = await Course.findOneAndUpdate(
      { slug },
      { $push: { lessons: { title, content, video, slug: slugify(title) } } },
      { new: true },
    )
      .populate('instructor', '_id name')
      .exec();

    return res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const update = async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug }).exec();
    if (req.user._id !== course.instructor.toString()) {
      return res.status(400).json({ message: 'Unauthorized' });
    }

    if (course.image && req.body.image && course.image.Key !== req.body.image.Key) {
      S3.deleteObject({ Bucket: course.image.Bucket, Key: course.image.Key }, (err, data) => {
        if (err) return res.sendStatus(400);
      });
    }
    const updated = await Course.findOneAndUpdate({ slug }, req.body, { new: true }).exec();

    return res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const removeLesson = async (req, res) => {
  try {
    const { slug, lessonId } = req.params;
    const course = await Course.findOne({ slug }).exec();

    if (req.user._id !== course.instructor.toString()) {
      return res.status(400).json({ message: 'Unauthorized' });
    }
    console.log('masuk');
    const deleted = await Course.findOneAndUpdate(
      { _id: course._id },
      {
        $pull: { lessons: { _id: lessonId } },
      },
    ).exec();

    console.log('masuk2');
    const lesson = course.lessons.find((v) => v._id.toString() === lessonId);

    console.log('masuk3');
    if (lesson.video) {
      S3.deleteObject({ Bucket: lesson.video.Bucket, Key: lesson.video.Key }, (err, data) => {
        if (err) return res.sendStatus(400);
      });
    }

    console.log('masuk4');
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const updateLesson = async (req, res) => {
  try {
    const { slug } = req.params;
    const { _id, title, content, video, free_preview } = req.body;
    const course = await Course.findOne({ slug }).select('instructor').exec();

    if (course.instructor._id.toString() !== req.user._id) {
      return res.status(400).json({ message: 'Unauthorized' });
    }

    const updated = await Course.updateOne(
      { 'lessons._id': _id },
      {
        $set: {
          'lessons.$.title': title,
          'lessons.$.content': content,
          'lessons.$.video': video,
          'lessons.$.free_preview': free_preview,
        },
      },
      { new: true },
    ).exec();

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
