# 🚀 Complete Schema Migration

## 📋 Описание

Эта миграция создает полную схему базы данных с нуля, включая все необходимые таблицы, поля, индексы и тестовые данные.

## 🗂️ Создаваемые таблицы

### 1. **users** - Пользователи системы

- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `full_name` (VARCHAR)
- `roles` (TEXT, Default: 'tenant')
- `password` (VARCHAR)
- `google_id` (VARCHAR)
- `phone` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

### 2. **preferences** - Предпочтения пользователей

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `primary_postcode` (VARCHAR)
- `secondary_location` (VARCHAR)
- `commute_location` (VARCHAR)
- `commute_time_walk/cycle/tube` (INTEGER)
- `move_in_date`, `move_out_date` (DATE)
- `min/max_price` (INTEGER)
- `min/max_bedrooms/bathrooms` (INTEGER)
- `furnishing`, `location`, `building_style` (TEXT)
- `designer_furniture`, `house_shares` (VARCHAR)
- `let_duration`, `property_type` (TEXT)
- `hobbies`, `ideal_living_environment`, `pets`, `smoker`, `additional_info` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

### 3. **tenant_profiles** - Профили арендаторов

- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `shortlisted_properties` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

### 4. **operator_profiles** - Профили операторов

- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `full_name`, `company_name`, `phone` (VARCHAR)
- `date_of_birth` (DATE)
- `nationality` (VARCHAR)
- `business_address`, `company_registration`, `vat_number`, `license_number` (VARCHAR)
- `years_experience` (INTEGER)
- `operating_areas`, `property_types`, `services`, `business_description` (TEXT)
- `website`, `linkedin` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

### 5. **properties** - Объекты недвижимости

- `id` (UUID, Primary Key)
- `title`, `description`, `address` (TEXT/VARCHAR)
- `price` (DECIMAL(10,2))
- `bedrooms`, `bathrooms` (INTEGER)
- `property_type`, `furnishing` (VARCHAR)
- `lifestyle_features` (TEXT)
- `available_from` (DATE)
- `images` (TEXT)
- `is_btr` (BOOLEAN)
- `lat`, `lng` (DECIMAL(10,7))
- `operator_id` (UUID, Foreign Key)
- `created_at`, `updated_at` (TIMESTAMP)

### 6. **property_media** - Медиа файлы объектов

- `id` (UUID, Primary Key)
- `property_id` (UUID, Foreign Key)
- `s3_key`, `url`, `media_type` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

### 7. **favourites** - Избранные объекты

- `id` (UUID, Primary Key)
- `user_id`, `property_id` (UUID, Foreign Keys)
- `created_at` (TIMESTAMP)

### 8. **shortlist** - Список желаний

- `id` (UUID, Primary Key)
- `user_id`, `property_id` (UUID, Foreign Keys)
- `created_at` (TIMESTAMP)

## 🔗 Связи между таблицами

- **users** → **preferences** (1:1)
- **users** → **tenant_profiles** (1:1)
- **users** → **operator_profiles** (1:1)
- **users** → **properties** (1:many, operator_id)
- **properties** → **property_media** (1:many)
- **users** → **favourites** (1:many)
- **properties** → **favourites** (1:many)
- **users** → **shortlist** (1:many)
- **properties** → **shortlist** (1:many)

## 🔍 Индексы

- `IDX_users_email` - на поле email
- `IDX_users_google_id` - на поле google_id
- `IDX_users_roles` - на поле roles
- `IDX_preferences_user_id` - на поле user_id
- `IDX_properties_operator_id` - на поле operator_id
- `IDX_properties_price` - на поле price
- `IDX_properties_bedrooms` - на поле bedrooms
- `IDX_properties_property_type` - на поле property_type
- `IDX_property_media_property_id` - на поле property_id

## 🌱 Тестовые данные

Миграция автоматически создает:

- Тестового оператора: `operator@test.com`
- 3 тестовых объекта недвижимости с разными характеристиками

## 🚀 Развертывание

### Локальное тестирование

```bash
npm run test:complete-migration
```

### Продакшн развертывание

```bash
npm run deploy:migrations:prod
```

## 📝 Важные особенности

1. **Все поля nullable** - для гибкости
2. **CASCADE удаление** - при удалении пользователя удаляются все связанные данные
3. **UUID первичные ключи** - для безопасности и масштабируемости
4. **Автоматические timestamps** - created_at и updated_at
5. **Правильные типы данных** - соответствуют entity

## 🔄 Откат

Для отката миграции используйте:

```typescript
await migration.down(queryRunner);
```

Это удалит все таблицы в правильном порядке (сначала зависимые, потом основные).

## ✅ Проверка

После выполнения миграции проверьте:

1. Все таблицы созданы
2. Все поля присутствуют
3. Все связи работают
4. Тестовые данные загружены
5. Индексы созданы
