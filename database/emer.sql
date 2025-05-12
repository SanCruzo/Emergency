-- Table: mob_er.user

-- DROP TABLE IF EXISTS mob_er."user";

CREATE TABLE IF NOT EXISTS mob_er."user"
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    role character varying(20) COLLATE pg_catalog."default",
    mfa_secret text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true,
    CONSTRAINT user_pkey PRIMARY KEY (id),
    CONSTRAINT user_email_key UNIQUE (email),
    CONSTRAINT user_role_check CHECK (role::text = ANY (ARRAY['admin'::character varying, 'ambulance'::character varying, 'hospital'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS mob_er."user"
    OWNER to "ER";



-- Table: mob_er.Livechat

-- DROP TABLE IF EXISTS mob_er."Livechat";

CREATE TABLE IF NOT EXISTS mob_er."Livechat"
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    sender_id uuid NOT NULL,
    receiver_id uuid NOT NULL,
    message text COLLATE pg_catalog."default" NOT NULL,
    status character varying(10) COLLATE pg_catalog."default" DEFAULT 'sent'::character varying,
    edited_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Livechat_pkey" PRIMARY KEY (id),
    CONSTRAINT "Livechat_receiver_id_fkey" FOREIGN KEY (receiver_id)
        REFERENCES mob_er."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "Livechat_sender_id_fkey" FOREIGN KEY (sender_id)
        REFERENCES mob_er."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "Livechat_status_check" CHECK (status::text = ANY (ARRAY['sent'::character varying, 'delivered'::character varying, 'read'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS mob_er."Livechat"
    OWNER to "ER";

-- Table: mob_er.ambulance

-- DROP TABLE IF EXISTS mob_er.ambulance;

CREATE TABLE IF NOT EXISTS mob_er.ambulance
(
    ambulance_id uuid NOT NULL,
    lat numeric(9,6) NOT NULL,
    "long" numeric(9,6) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    plate_number character varying(20) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT ambulance_pkey PRIMARY KEY (ambulance_id),
    CONSTRAINT ambulance_plate_number_key UNIQUE (plate_number),
    CONSTRAINT ambulance_ambulance_id_fkey FOREIGN KEY (ambulance_id)
        REFERENCES mob_er."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS mob_er.ambulance
    OWNER to "ER";
-- Table: mob_er.patient

-- DROP TABLE IF EXISTS mob_er.patient;

CREATE TABLE IF NOT EXISTS mob_er.patient
(
    patientid uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    middlename character varying(50) COLLATE pg_catalog."default",
    surname character varying(50) COLLATE pg_catalog."default" NOT NULL,
    age integer,
    sex character(1) COLLATE pg_catalog."default",
    CONSTRAINT patient_pkey PRIMARY KEY (patientid),
    CONSTRAINT patient_age_check CHECK (age >= 0),
    CONSTRAINT patient_sex_check CHECK (sex = ANY (ARRAY['M'::bpchar, 'F'::bpchar]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS mob_er.patient
    OWNER to "ER";

    -- Table: mob_er.vital_signs

-- DROP TABLE IF EXISTS mob_er.vital_signs;

CREATE TABLE IF NOT EXISTS mob_er.vital_signs
(
    patientid uuid NOT NULL,
    heartrate integer,
    bloodpressure character varying(20) COLLATE pg_catalog."default",
    temperature numeric(4,2),
    respirationrate integer,
    recordedat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT vital_signs_pkey PRIMARY KEY (patientid),
    CONSTRAINT vital_signs_patientid_fkey FOREIGN KEY (patientid)
        REFERENCES mob_er.patient (patientid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS mob_er.vital_signs
    OWNER to "ER";