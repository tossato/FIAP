create table if not exists alunos
(
    id              bigint unsigned auto_increment
        primary key,
    usuario         int          not null,
    nome            varchar(100) not null,
    data_nascimento date         not null,
    status          varchar(10)  not null,
    created_at      timestamp    null,
    updated_at      timestamp    null,
    constraint alunos_usuario_unique
        unique (usuario)
)
    collate = utf8mb4_unicode_ci;

create table if not exists cache
(
    `key`      varchar(255) not null
        primary key,
    value      mediumtext   not null,
    expiration int          not null
)
    collate = utf8mb4_unicode_ci;

create table if not exists cache_locks
(
    `key`      varchar(255) not null
        primary key,
    owner      varchar(255) not null,
    expiration int          not null
)
    collate = utf8mb4_unicode_ci;

create table if not exists failed_jobs
(
    id         bigint unsigned auto_increment
        primary key,
    uuid       varchar(255)                        not null,
    connection text                                not null,
    queue      text                                not null,
    payload    longtext                            not null,
    exception  longtext                            not null,
    failed_at  timestamp default CURRENT_TIMESTAMP not null,
    constraint failed_jobs_uuid_unique
        unique (uuid)
)
    collate = utf8mb4_unicode_ci;

create table if not exists job_batches
(
    id             varchar(255) not null
        primary key,
    name           varchar(255) not null,
    total_jobs     int          not null,
    pending_jobs   int          not null,
    failed_jobs    int          not null,
    failed_job_ids longtext     not null,
    options        mediumtext   null,
    cancelled_at   int          null,
    created_at     int          not null,
    finished_at    int          null
)
    collate = utf8mb4_unicode_ci;

create table if not exists jobs
(
    id           bigint unsigned auto_increment
        primary key,
    queue        varchar(255)     not null,
    payload      longtext         not null,
    attempts     tinyint unsigned not null,
    reserved_at  int unsigned     null,
    available_at int unsigned     not null,
    created_at   int unsigned     not null
)
    collate = utf8mb4_unicode_ci;

create index jobs_queue_index
    on jobs (queue);

create table if not exists migrations
(
    id        int unsigned auto_increment
        primary key,
    migration varchar(255) not null,
    batch     int          not null
)
    collate = utf8mb4_unicode_ci;

create table if not exists password_reset_tokens
(
    email      varchar(255) not null
        primary key,
    token      varchar(255) not null,
    created_at timestamp    null
)
    collate = utf8mb4_unicode_ci;

create table if not exists personal_access_tokens
(
    id             bigint unsigned auto_increment
        primary key,
    tokenable_type varchar(255)    not null,
    tokenable_id   bigint unsigned not null,
    name           varchar(255)    not null,
    token          varchar(64)     not null,
    abilities      text            null,
    last_used_at   timestamp       null,
    expires_at     timestamp       null,
    created_at     timestamp       null,
    updated_at     timestamp       null,
    constraint personal_access_tokens_token_unique
        unique (token)
)
    collate = utf8mb4_unicode_ci;

create index personal_access_tokens_tokenable_type_tokenable_id_index
    on personal_access_tokens (tokenable_type, tokenable_id);

create table if not exists sessions
(
    id            varchar(255)    not null
        primary key,
    user_id       bigint unsigned null,
    ip_address    varchar(45)     null,
    user_agent    text            null,
    payload       longtext        not null,
    last_activity int             not null
)
    collate = utf8mb4_unicode_ci;

create index sessions_last_activity_index
    on sessions (last_activity);

create index sessions_user_id_index
    on sessions (user_id);

create table if not exists turmas
(
    id         bigint unsigned auto_increment
        primary key,
    nome       varchar(100) not null,
    descricao  varchar(255) not null,
    tipo       varchar(50)  not null,
    created_at timestamp    null,
    updated_at timestamp    null
)
    collate = utf8mb4_unicode_ci;

create table if not exists matriculas
(
    id         bigint unsigned auto_increment
        primary key,
    id_aluno   bigint unsigned not null,
    id_turma   bigint unsigned not null,
    created_at timestamp       null,
    updated_at timestamp       null,
    constraint matriculas_id_aluno_id_turma_unique
        unique (id_aluno, id_turma),
    constraint matriculas_id_aluno_foreign
        foreign key (id_aluno) references alunos (id)
            on delete cascade,
    constraint matriculas_id_turma_foreign
        foreign key (id_turma) references turmas (id)
            on delete cascade
)
    collate = utf8mb4_unicode_ci;

create table if not exists users
(
    id                bigint unsigned auto_increment
        primary key,
    name              varchar(255) not null,
    email             varchar(255) not null,
    email_verified_at timestamp    null,
    password          varchar(255) not null,
    remember_token    varchar(100) null,
    created_at        timestamp    null,
    updated_at        timestamp    null,
    constraint users_email_unique
        unique (email)
)
    collate = utf8mb4_unicode_ci;

INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (1, 98534, 'Johnnie Torp', '1976-08-03', 'inativo', '2024-11-15 17:26:05', '2024-11-15 17:26:05');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (2, 24419, 'Anika Farrell', '1991-02-22', 'inativo', '2024-11-15 17:26:06', '2024-11-15 17:26:06');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (3, 94611, 'Piper Hodkiewicz DVM', '1979-09-22', 'inativo', '2024-11-15 17:26:07', '2024-11-15 17:26:07');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (4, 57521, 'Westley Boyle', '1992-12-05', 'inativo', '2024-11-15 17:26:07', '2024-11-15 17:26:07');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (5, 20341, 'Dr. Ron Reinger MD', '1982-03-28', 'ativo', '2024-11-15 17:26:07', '2024-11-15 17:26:07');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (6, 66789, 'Ms. Krystel Friesen DDS', '1988-05-21', 'inativo', '2024-11-15 17:26:07', '2024-11-15 17:26:07');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (7, 20870, 'Julio Champlin', '1975-05-01', 'inativo', '2024-11-15 17:26:08', '2024-11-15 17:26:08');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (8, 39370, 'Erwin Bergnaum', '2012-04-04', 'inativo', '2024-11-15 17:26:08', '2024-11-15 17:26:08');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (9, 57405, 'Jaunita Sawayn V', '1993-01-19', 'inativo', '2024-11-15 17:26:08', '2024-11-15 17:26:08');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (10, 86323, 'Carmelo Shanahan', '1977-07-31', 'inativo', '2024-11-15 17:26:08', '2024-11-15 17:26:08');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (11, 74373, 'Judson Hickle', '2020-09-08', 'inativo', '2024-11-15 17:26:09', '2024-11-15 17:26:09');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (12, 97325, 'Eino Schuppe', '2014-07-11', 'inativo', '2024-11-15 17:26:09', '2024-11-15 17:26:09');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (13, 20931, 'Dr. Angeline Konopelski DVM', '1972-11-14', 'ativo', '2024-11-15 17:26:09', '2024-11-15 17:26:09');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (14, 53396, 'Dr. King Cremin', '1979-05-19', 'inativo', '2024-11-15 17:26:09', '2024-11-15 17:26:09');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (15, 53547, 'Nikolas Marvin II', '2017-04-10', 'inativo', '2024-11-15 17:26:10', '2024-11-15 17:26:10');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (16, 10398, 'Dr. Candice Haley III', '2020-08-17', 'inativo', '2024-11-15 17:26:10', '2024-11-15 17:26:10');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (17, 73319, 'Clair Kulas', '1991-07-27', 'inativo', '2024-11-15 17:26:10', '2024-11-15 17:26:10');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (18, 28931, 'Wilber Larkin', '1973-07-20', 'ativo', '2024-11-15 17:26:10', '2024-11-15 17:26:10');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (19, 77344, 'Felipa Welch', '1977-03-12', 'ativo', '2024-11-15 17:26:11', '2024-11-15 17:26:11');
INSERT INTO alunos (id, usuario, nome, data_nascimento, status, created_at, updated_at) VALUES (20, 98949, 'Mrs. Nellie Heidenreich', '2020-08-17', 'inativo', '2024-11-15 17:26:11', '2024-11-15 17:26:11');

INSERT INTO turmas (id, nome, descricao, tipo, created_at, updated_at) VALUES (1, 'officiis', 'Nostrum temporibus illum repudiandae rerum commodi rem perferendis iste.', 'online', '2024-11-15 17:26:11', '2024-11-15 17:26:11');
INSERT INTO turmas (id, nome, descricao, tipo, created_at, updated_at) VALUES (2, 'id', 'Dolore laudantium voluptatem voluptas numquam et ut at sit.', 'online', '2024-11-15 17:26:12', '2024-11-15 17:26:12');
INSERT INTO turmas (id, nome, descricao, tipo, created_at, updated_at) VALUES (3, 'laboriosam', 'Necessitatibus provident omnis eligendi non.', 'presencial', '2024-11-15 17:26:12', '2024-11-15 17:26:12');
INSERT INTO turmas (id, nome, descricao, tipo, created_at, updated_at) VALUES (4, 'culpa', 'Optio placeat ab laboriosam.', 'presencial', '2024-11-15 17:26:12', '2024-11-15 17:26:12');
INSERT INTO turmas (id, nome, descricao, tipo, created_at, updated_at) VALUES (5, 'non', 'Ex provident culpa et non est commodi voluptates.', 'presencial', '2024-11-15 17:26:12', '2024-11-15 17:26:12');
INSERT INTO turmas (id, nome, descricao, tipo, created_at, updated_at) VALUES (6, 'ea', 'Reprehenderit pariatur illum odio maiores deleniti delectus sint.', 'online', '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO turmas (id, nome, descricao, tipo, created_at, updated_at) VALUES (7, 'laboriosam', 'Mollitia quod dolorem esse fuga magnam.', 'online', '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO turmas (id, nome, descricao, tipo, created_at, updated_at) VALUES (8, 'quia', 'Dolore dolor quod beatae alias voluptate.', 'online', '2024-11-15 17:26:13', '2024-11-15 17:26:13');

INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (1, 1, 1, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (2, 1, 2, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (3, 2, 5, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (4, 3, 2, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (5, 3, 5, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (6, 4, 4, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (7, 4, 5, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (8, 5, 8, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (9, 6, 8, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (10, 7, 1, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (11, 8, 8, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (12, 9, 4, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (13, 10, 6, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (14, 11, 1, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (15, 12, 7, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (16, 13, 1, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (17, 14, 4, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (18, 14, 6, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (19, 15, 1, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (20, 16, 2, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (21, 16, 7, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (22, 17, 8, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (23, 18, 3, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (24, 19, 2, '2024-11-15 17:26:13', '2024-11-15 17:26:13');
INSERT INTO matriculas (id, id_aluno, id_turma, created_at, updated_at) VALUES (25, 20, 1, '2024-11-15 17:26:13', '2024-11-15 17:26:13');