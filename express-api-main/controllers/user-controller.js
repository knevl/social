const { prisma } = require('../prisma/prisma-client');
const bcrypt = require('bcryptjs');
const Jdenticon = require('jdenticon');
const path = require('path');
const fs = require('fs');
const { error } = require('console');
const jwt = require('jsonwebtoken');
/* главный юзер контроллер */
const createError = { error: 'Все поля обязательны' };
const UserController = {
  /* регистрация */
  register: async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json(createError);
    }
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Пользователь уже существует' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      //генерируем pgn аватарку для пользователя , 200 число написано в документации
      const png = Jdenticon.toPng(`${name}${Date.now()}`, 200);
      const avatarName = `${name}_${Date.now()}.png`;
      const avatarPath = path.join(__dirname, '/../uploads', avatarName);
      fs.writeFileSync(avatarPath, png);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          avatarUrl: `/uploads/${avatarName}`,
        },
      });
      res.json(user);
    } catch (error) {
      console.error('Error in register', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  /* вход */
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json(createError);
    }
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'Неверный логин или пароль' });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(400).json({ error: 'Неверный логин или пароль' });
      }
      //в токене шифруем id пользователя
      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
      res.json({ token });
    } catch (error) {
      console.error('Error in login', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  /* получение пользователя по параметру id */
  getUserById: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    try {
      //findUnique работает только с id
      const user = await prisma.user.findUnique({
        where: { id },
        //эта строка добавляет в user еще его подписчиков и на кого подписан
        include: { followers: true, following: true },
      });
      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      const isFollowing = await prisma.follows.findFirst({
        where: { AND: [{ followerId: userId }, { followingId: id }] },
      });
      res.json({ ...user, isFollowing: Boolean(isFollowing) });
    } catch (error) {
      console.error('Get Current Error', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
/* редакирование профиля*/
  updateUser: async (req, res) => {
    const { id } = req.params;
    const { email, name, dateOfBirth, bio, location } = req.body;
    let filePath;
    if (req.file && req.file.path) {
      filepath = req.file.path;
    }
    if (id !== req.user.userId) {
      res.status(403).json({ error: 'Нет доступа' });
    }
    try {
      if (email) {
        const existingUser = await prisma.user.findFirst({
          where: { email: email },
        });
        if (existingUser && existingUser.id !== id) {
          return res.status(400).json({ error: 'Почта уже используется' });
        }
      }
      const user = await prisma.user.update({
        where: { id },
        data: {
          email: email || undefined,
          name: name || undefined,
          avatarUrl: filePath ? `/${filePath}` : undefined,
          dateOfBirth: dateOfBirth || undefined,
          bio: bio || undefined,
          location: location || undefined,
        },
      });
      res.json(user);
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ error: 'Что-то пошло не так' });
    }
  },
  current: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        include: {
          followers: {
            include: {
              follower: true,
            },
          },
          following: {
            include: {
              following: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(400).json({ error: 'Не удалось найти пользователя' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.log('err', error);
      res.status(500).json({ error: 'Что-то пошло не так' });
    }
  },
};

module.exports = UserController;
