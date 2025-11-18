--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'user',
    'artist',
    'admin'
);


--
-- Name: create_song_analytics(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_song_analytics() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.song_analytics (song_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;


--
-- Name: handle_new_user_profile(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user_profile() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', '')
  );
  RETURN NEW;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: artist_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.artist_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    stage_name text NOT NULL,
    bio text,
    avatar_url text,
    cover_image_url text,
    instagram_url text,
    youtube_url text,
    spotify_url text,
    apple_music_url text,
    total_followers integer DEFAULT 0,
    total_subscribers integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    full_name text NOT NULL,
    phone_number text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: song_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.song_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    song_id uuid NOT NULL,
    total_plays integer DEFAULT 0,
    total_likes integer DEFAULT 0,
    total_comments integer DEFAULT 0,
    plays_last_7_days integer DEFAULT 0,
    plays_last_30_days integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: songs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.songs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    artist_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    lyrics text,
    audio_url text NOT NULL,
    cover_image_url text,
    genre text,
    featured_artists text[],
    tags text[],
    duration integer,
    category text,
    comment_limit_type text DEFAULT 'unlimited'::text,
    comment_limit_count integer,
    is_scheduled boolean DEFAULT false,
    scheduled_release_at timestamp with time zone,
    is_published boolean DEFAULT false,
    is_draft boolean DEFAULT true,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT songs_comment_limit_type_check CHECK ((comment_limit_type = ANY (ARRAY['unlimited'::text, 'followers'::text, 'subscribers'::text, 'none'::text, 'custom'::text])))
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: artist_profiles artist_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.artist_profiles
    ADD CONSTRAINT artist_profiles_pkey PRIMARY KEY (id);


--
-- Name: artist_profiles artist_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.artist_profiles
    ADD CONSTRAINT artist_profiles_user_id_key UNIQUE (user_id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: song_analytics song_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.song_analytics
    ADD CONSTRAINT song_analytics_pkey PRIMARY KEY (id);


--
-- Name: song_analytics song_analytics_song_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.song_analytics
    ADD CONSTRAINT song_analytics_song_id_key UNIQUE (song_id);


--
-- Name: songs songs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.songs
    ADD CONSTRAINT songs_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: songs on_song_created; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_song_created AFTER INSERT ON public.songs FOR EACH ROW EXECUTE FUNCTION public.create_song_analytics();


--
-- Name: artist_profiles update_artist_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_artist_profiles_updated_at BEFORE UPDATE ON public.artist_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: song_analytics update_song_analytics_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_song_analytics_updated_at BEFORE UPDATE ON public.song_analytics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: songs update_songs_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON public.songs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: artist_profiles artist_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.artist_profiles
    ADD CONSTRAINT artist_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: song_analytics song_analytics_song_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.song_analytics
    ADD CONSTRAINT song_analytics_song_id_fkey FOREIGN KEY (song_id) REFERENCES public.songs(id) ON DELETE CASCADE;


--
-- Name: songs songs_artist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.songs
    ADD CONSTRAINT songs_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artist_profiles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles Admins can view all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: song_analytics Anyone can view analytics for published songs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view analytics for published songs" ON public.song_analytics FOR SELECT USING ((song_id IN ( SELECT songs.id
   FROM public.songs
  WHERE (songs.is_published = true))));


--
-- Name: artist_profiles Anyone can view artist profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view artist profiles" ON public.artist_profiles FOR SELECT USING (true);


--
-- Name: songs Anyone can view published songs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view published songs" ON public.songs FOR SELECT USING (((is_published = true) AND (is_draft = false)));


--
-- Name: songs Artists can delete their own songs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Artists can delete their own songs" ON public.songs FOR DELETE USING ((artist_id IN ( SELECT artist_profiles.id
   FROM public.artist_profiles
  WHERE (artist_profiles.user_id = auth.uid()))));


--
-- Name: artist_profiles Artists can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Artists can insert their own profile" ON public.artist_profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: songs Artists can insert their own songs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Artists can insert their own songs" ON public.songs FOR INSERT WITH CHECK ((artist_id IN ( SELECT artist_profiles.id
   FROM public.artist_profiles
  WHERE (artist_profiles.user_id = auth.uid()))));


--
-- Name: artist_profiles Artists can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Artists can update their own profile" ON public.artist_profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: songs Artists can update their own songs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Artists can update their own songs" ON public.songs FOR UPDATE USING ((artist_id IN ( SELECT artist_profiles.id
   FROM public.artist_profiles
  WHERE (artist_profiles.user_id = auth.uid()))));


--
-- Name: song_analytics Artists can view analytics for their own songs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Artists can view analytics for their own songs" ON public.song_analytics FOR SELECT USING ((song_id IN ( SELECT s.id
   FROM (public.songs s
     JOIN public.artist_profiles ap ON ((s.artist_id = ap.id)))
  WHERE (ap.user_id = auth.uid()))));


--
-- Name: songs Artists can view their own songs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Artists can view their own songs" ON public.songs FOR SELECT USING ((artist_id IN ( SELECT artist_profiles.id
   FROM public.artist_profiles
  WHERE (artist_profiles.user_id = auth.uid()))));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: artist_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.artist_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: song_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.song_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: songs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


