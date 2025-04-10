CREATE DATABASE beautyassistant;
USE beautyassistant;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    age INT NOT NULL CHECK (age >= 16 AND age <= 100),
    skinType ENUM('normal', 'dry', 'oily') NOT NULL, 
    skinTone ENUM('fair', 'medium', 'dark') NOT NULL,
    concerns SET('acne', 'wrinkles', 'pigmentation'),
    experience ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    faceShape ENUM('oval', 'circle', 'square') NOT NULL,
    eyeColor ENUM('brown', 'blue', 'green') NOT NULL,
    hairColor ENUM('black', 'brown', 'blonde') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skinRoutineTips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ageGroup ENUM('16-25', '26-40', '41-60', '61-100') NOT NULL,
    skinType ENUM('normal', 'dry', 'oily') NOT NULL,
    concerns SET('acne', 'wrinkles', 'pigmentation') NOT NULL,
    dayRoutine TEXT NOT NULL,
    nightRoutine TEXT NOT NULL
);

SELECT srt.dayRoutine, srt.nightRoutine
FROM skinRoutineTips srt
WHERE srt.skinType = (SELECT skinType FROM users WHERE id = 1) -- replace with user's id
AND srt.concerns = (SELECT concerns FROM users WHERE id = 1) -- replace with user's id
AND srt.ageGroup = (
    SELECT CASE
        WHEN age BETWEEN 16 AND 25 THEN '16-25'
        WHEN age BETWEEN 26 AND 40 THEN '26-40'
        WHEN age BETWEEN 41 AND 60 THEN '41-60'
        WHEN age BETWEEN 61 AND 100 THEN '61-100'
    END
    FROM users
    WHERE id = 1 -- replace with user's id
);

-- Makeup
CREATE TABLE makeupTips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ageGroup ENUM('16-25', '26-40', '41-60', '61-100') NOT NULL,
    skinTone ENUM('fair', 'medium', 'dark') NOT NULL,
    faceShape ENUM('oval', 'circle', 'square') NOT NULL,
    eyeColor ENUM('brown', 'blue', 'green') NOT NULL,
    hairColor ENUM('black', 'brown', 'blonde') NOT NULL,
    everyDayMakeup TEXT NOT NULL,
    nightMakeup TEXT NOT NULL,
    weddingMakeup TEXT NOT NULL
);

INSERT INTO makeupTips (ageGroup, skinTone, faceShape, eyeColor, hairColor, everyDayMakeup, nightMakeup, weddingMakeup)
SELECT 
    a.ageGroup,
    s.skinTone,
    f.faceShape,
    e.eyeColor,
    h.hairColor,
    CONCAT(
        '1. Нанеси ', 
        CASE s.skinTone 
            WHEN 'fair' THEN 'лек фон дьо тен' 
            WHEN 'medium' THEN 'фон дьо тен със среден тон' 
            WHEN 'dark' THEN 'фон дьо тен с тъмен тон' 
        END,
        '\n2. ', 
        CASE f.faceShape 
            WHEN 'oval' THEN 'Подчертай овалното лице с лек руж' 
            WHEN 'circle' THEN 'Контурирай за удължаване на кръглото лице' 
            WHEN 'square' THEN 'Омекоти челюстта с контуриране' 
        END,
        '\n3. Използвай ', 
        CASE e.eyeColor 
            WHEN 'brown' THEN 'топли кафяви сенки' 
            WHEN 'blue' THEN 'студени сини сенки' 
            WHEN 'green' THEN 'зелени или златни сенки' 
        END,
        '\n4. Завърши с ',
        CASE h.hairColor 
            WHEN 'black' THEN 'неутрално червило' 
            WHEN 'brown' THEN 'коралов гланц' 
            WHEN 'blonde' THEN 'розов гланц' 
        END
    ) AS everyDayMakeup,
    CONCAT(
        '1. Нанеси фон дьо тен с пълно покритие',
        '\n2. ', 
        CASE f.faceShape 
            WHEN 'oval' THEN 'Добави леко контуриране' 
            WHEN 'circle' THEN 'Добави тъмно контуриране за удължаване' 
            WHEN 'square' THEN 'Контурирай квадратното лице' 
        END,
        '\n3. Използвай ', 
        CASE e.eyeColor 
            WHEN 'brown' THEN 'златни или опушени сенки' 
            WHEN 'blue' THEN 'тъмносини сенки' 
            WHEN 'green' THEN 'лилави или опушени сенки' 
        END,
        '\n4. Завърши с ',
        CASE h.hairColor 
            WHEN 'black' THEN 'тъмно червило' 
            WHEN 'brown' THEN 'бордо червило' 
            WHEN 'blonde' THEN 'тъмнорозово червило' 
        END
    ) AS nightMakeup,
    CONCAT(
        '1. Нанеси сияен фон дьо тен',
        '\n2. Подчертай скулите с ',
        CASE s.skinTone 
            WHEN 'fair' THEN 'лек бронзант' 
            WHEN 'medium' THEN 'бронзант' 
            WHEN 'dark' THEN 'наситен бронзант' 
        END,
        '\n3. Използвай ', 
        CASE e.eyeColor 
            WHEN 'brown' THEN 'топли сенки' 
            WHEN 'blue' THEN 'сребристи сенки' 
            WHEN 'green' THEN 'златни сенки' 
        END,
        ' за ', e.eyeColor, ' очи',
        '\n4. Завърши с ',
        CASE a.ageGroup 
            WHEN '16-25' THEN 'нежно розово червило' 
            WHEN '26-40' THEN 'класическо червено червило' 
            WHEN '41-60' THEN 'винено червило' 
            WHEN '61-100' THEN 'елегантно червено червило' 
        END
    ) AS weddingMakeup
FROM 
    (SELECT '16-25' AS ageGroup UNION SELECT '26-40' UNION SELECT '41-60' UNION SELECT '61-100') a,
    (SELECT 'fair' AS skinTone UNION SELECT 'medium' UNION SELECT 'dark') s,
    (SELECT 'oval' AS faceShape UNION SELECT 'circle' UNION SELECT 'square') f,
    (SELECT 'brown' AS eyeColor UNION SELECT 'blue' UNION SELECT 'green') e,
    (SELECT 'black' AS hairColor UNION SELECT 'brown' UNION SELECT 'blonde') h;

SELECT mt.everyDayMakeup, mt.nightMakeup, mt.weddingMakeup
FROM users u
JOIN makeupTips mt 
  ON mt.skinTone = u.skinTone
  AND mt.faceShape = u.faceShape
  AND mt.eyeColor = u.eyeColor
  AND mt.hairColor = u.hairColor
  AND mt.ageGroup = (
      CASE
          WHEN u.age BETWEEN 16 AND 25 THEN '16-25'
          WHEN u.age BETWEEN 26 AND 40 THEN '26-40'
          WHEN u.age BETWEEN 41 AND 60 THEN '41-60'
          WHEN u.age BETWEEN 61 AND 100 THEN '61-100'
      END
  )
WHERE u.id = 1; -- replace with user's id