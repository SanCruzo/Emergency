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
    CONSTRAINT user_role_check CHECK (role::text = ANY (ARRAY['admin'::character varying, 'responder'::character varying, 'hospital'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS mob_er."user"
    OWNER to "ER";




-- Table: mob_er.messages

-- DROP TABLE IF EXISTS mob_er.messages;

CREATE TABLE IF NOT EXISTS mob_er.messages
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    sender_id uuid NOT NULL,
    receiver_id uuid NOT NULL,
    emergency_id uuid,
    encrypted_message text COLLATE pg_catalog."default" NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT messages_pkey PRIMARY KEY (id),
    CONSTRAINT messages_emergency_id_fkey FOREIGN KEY (emergency_id)
        REFERENCES mob_er.emergencies (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id)
        REFERENCES mob_er."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id)
        REFERENCES mob_er."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS mob_er.messages
    OWNER to "ER";


-- Table: mob_er.emergencies

-- DROP TABLE IF EXISTS mob_er.emergencies;

CREATE TABLE IF NOT EXISTS mob_er.emergencies
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    status character varying(20) COLLATE pg_catalog."default" NOT NULL,
    created_by uuid NOT NULL,
    location_lat numeric(9,6) NOT NULL,
    location_long numeric(9,6) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT emergencies_pkey PRIMARY KEY (id),
    CONSTRAINT emergencies_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES mob_er."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT emergencies_status_check CHECK (status::text = ANY (ARRAY['full'::character varying, 'available'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS mob_er.emergencies
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
