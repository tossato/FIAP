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

INSERT INTO softsi01_fiap.users (id, name, email, email_verified_at, password, remember_token, created_at, updated_at) VALUES (3, 'Vanessa', 'vanessa@fiap.com.br', null, '$2y$12$Z41MddXJU.6KiIlr9tMc/.6nAypN5p.qoHoOMvSR6kTNj8rguqtZ.', null, '2024-11-15 13:19:10', '2024-11-15 13:19:10');


