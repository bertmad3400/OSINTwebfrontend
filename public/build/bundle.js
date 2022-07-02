
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/shared/icons.svelte generated by Svelte v3.48.0 */

    const file$M = "src/components/shared/icons.svelte";

    function create_fragment$S(ctx) {
    	let svg;
    	let raw_value = /*displayIcon*/ ctx[2].svg + "";

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "class", /*className*/ ctx[1]);
    			attr_dev(svg, "focusable", /*focusable*/ ctx[0]);
    			attr_dev(svg, "height", /*displayIcon*/ ctx[2].box);
    			attr_dev(svg, "width", /*displayIcon*/ ctx[2].box);
    			attr_dev(svg, "viewBox", "0 0\n\t" + /*displayIcon*/ ctx[2].box + "\n\t" + /*displayIcon*/ ctx[2].box);
    			add_location(svg, file$M, 113, 0, 12686);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			svg.innerHTML = raw_value;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*className*/ 2) {
    				attr_dev(svg, "class", /*className*/ ctx[1]);
    			}

    			if (dirty & /*focusable*/ 1) {
    				attr_dev(svg, "focusable", /*focusable*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$S.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$S($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icons', slots, []);
    	let { name } = $$props;
    	let { focusable = false } = $$props;
    	let { className = "" } = $$props;

    	let icons = {
    		"trashcan": {
    			box: 16,
    			svg: `<path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>`
    		},
    		"share": {
    			box: 16,
    			svg: `<path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>`
    		},
    		"arrow-down-right-square": {
    			box: 16,
    			svg: `  <path d="M14 16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12zM5.904 5.197 10 9.293V6.525a.5.5 0 0 1 1 0V10.5a.5.5 0 0 1-.5.5H6.525a.5.5 0 0 1 0-1h2.768L5.197 5.904a.5.5 0 0 1 .707-.707z"/>`
    		},
    		"send-plus": {
    			box: 16,
    			svg: `<path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855a.75.75 0 0 0-.124 1.329l4.995 3.178 1.531 2.406a.5.5 0 0 0 .844-.536L6.637 10.07l7.494-7.494-1.895 4.738a.5.5 0 1 0 .928.372l2.8-7Zm-2.54 1.183L5.93 9.363 1.591 6.602l11.833-4.733Z"/><path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5Z"/>`
    		},
    		"x": {
    			box: 16,
    			svg: `<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>`
    		},
    		"tick": {
    			box: 16,
    			svg: `<path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>`
    		},
    		"plus": {
    			box: 16,
    			svg: `<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>`
    		},
    		"download": {
    			box: 16,
    			svg: `<path d="M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5z"/><path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>`
    		},
    		"download-file": {
    			box: 16,
    			svg: `<path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>`
    		},
    		"calendar": {
    			box: 16,
    			svg: `<path d="M4.684 11.523v-2.3h2.261v-.61H4.684V6.801h2.464v-.61H4v5.332h.684zm3.296 0h.676V8.98c0-.554.227-1.007.953-1.007.125 0 .258.004.329.015v-.613a1.806 1.806 0 0 0-.254-.02c-.582 0-.891.32-1.012.567h-.02v-.504H7.98v4.105zm2.805-5.093c0 .238.192.425.43.425a.428.428 0 1 0 0-.855.426.426 0 0 0-.43.43zm.094 5.093h.672V7.418h-.672v4.105z"/> <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>`
    		},
    		"logo": {
    			box: 20,
    			svg: `<g fill="currentColor" fill-rule="nonzero"><path d="M8.713 2.465 1.16 10.016a1.789 1.789 0 0 0 0 2.53l4.959 4.959c.335.336.791.524 1.266.524l5.19-.004c.474 0 .928-.19 1.263-.524l4.955-4.955a1.789 1.789 0 0 0 0-2.53l-7.552-7.551a1.789 1.789 0 0 0-2.53 0Zm-6.845 8.259L9.42 3.172a.789.789 0 0 1 1.115 0l7.552 7.552a.789.789 0 0 1 0 1.115l-4.955 4.955a.789.789 0 0 1-.557.23l-5.19.005a.789.789 0 0 1-.558-.231l-4.959-4.959a.789.789 0 0 1 0-1.115Z"></path><path d="M9.57 6.647a.5.5 0 0 1 .764.637l-.057.07-3.75 3.75a.5.5 0 0 1-.765-.638l.058-.07 3.75-3.75ZM9.583 10.66a.5.5 0 0 1 .765.637l-.058.07-1.75 1.75a.5.5 0 0 1-.765-.639l.058-.069 1.75-1.75ZM10.45 13.53a.5.5 0 0 1 .765.637l-.058.07-.749.748a.5.5 0 0 1-.765-.638l.058-.07.749-.748Z"></path></g>`
    		},
    		"arrow": {
    			box: 20,
    			svg: `<path d="M6.432 3.218a.5.5 0 0 1 .638-.058l.07.058 6.428 6.428a.5.5 0 0 1 .058.638l-.058.07-6.429 6.428a.5.5 0 0 1-.765-.638l.058-.069 6.075-6.076-6.075-6.074a.5.5 0 0 1-.058-.638l.058-.07Z" fill="currentColor" fill-rule="nonzero"></path>`
    		},
    		"feed": {
    			box: 20,
    			svg: `<path d="M16.429 15.929a.5.5 0 0 1 .09.992l-.09.008H3.57a.5.5 0 0 1-.09-.992l.09-.008H16.43ZM7.857 2.357H4.286c-.67 0-1.215.544-1.215 1.214v3.572c0 .67.544 1.214 1.215 1.214h3.571c.67 0 1.214-.544 1.214-1.214V3.57c0-.67-.543-1.214-1.214-1.214Zm-3.571 1h3.571c.118 0 .214.096.214.214v3.572a.214.214 0 0 1-.214.214H4.286a.214.214 0 0 1-.215-.214V3.57c0-.118.096-.214.215-.214ZM16.429 10.929a.5.5 0 0 1 .09.992l-.09.008H3.57a.5.5 0 0 1-.09-.992l.09-.008H16.43ZM16.429 5.214a.5.5 0 0 1 .09.992l-.09.008h-5a.5.5 0 0 1-.09-.992l.09-.008h5Z"></path></g>`
    		},
    		"plus": {
    			box: 16,
    			svg: `<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>`
    		},
    		"read-later": {
    			box: 20,
    			svg: `<path d="M13 2.357H7a2.5 2.5 0 0 0-2.5 2.5v13l.007.084a.5.5 0 0 0 .723.36l4.775-2.478 4.764 2.478a.5.5 0 0 0 .731-.444v-13a2.5 2.5 0 0 0-2.5-2.5Zm0 1 .144.007A1.5 1.5 0 0 1 14.5 4.857v12.176l-4.263-2.217-.09-.036a.5.5 0 0 0-.37.036L5.5 17.034V4.857a1.5 1.5 0 0 1 1.5-1.5h6Z" fill="currentColor" fill-rule="nonzero"></path>`
    		},
    		"read-later-filled": {
    			box: 24,
    			svg: `<path d="M15.692 3H8.308C7.033 3 6 4.06 6 5.368v15.158l.006.08a.46.46 0 0 0 .668.34l5.332-2.84 5.32 2.84a.462.462 0 0 0 .674-.42V5.368C18 4.06 16.967 3 15.692 3Z" fill="currentColor" fill-rule="nonzero"></path>`
    		},
    		"gear": {
    			box: 16,
    			svg: `<path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>`
    		},
    		"logout": {
    			box: 16,
    			svg: `<path fill-rule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0v-2z"/><path fill-rule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>`
    		},
    		"magnifying-glass": {
    			box: 16,
    			svg: `<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>`
    		},
    		"three-dots": {
    			box: 16,
    			svg: `<path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>`
    		},
    		"favorite": {
    			box: 16,
    			svg: `<path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>`
    		},
    		"favorite-filled": {
    			box: 16,
    			svg: `<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>`
    		},
    		"linkedin": {
    			box: 24,
    			svg: `<g fill="currentColor" fill-rule="nonzero"><path d="M15.429 8.929a5.643 5.643 0 0 0-5.643 5.642v6a.5.5 0 0 0 .5.5h3.428a.5.5 0 0 0 .5-.5v-6a1.214 1.214 0 1 1 2.429 0v6a.5.5 0 0 0 .5.5h3.428a.5.5 0 0 0 .5-.5v-6A5.643 5.643 0 0 0 15.43 8.93Zm.212 1.004a4.643 4.643 0 0 1 4.43 4.638v5.5h-2.428v-5.5a2.214 2.214 0 0 0-2.214-2.214l-.159.006a2.214 2.214 0 0 0-2.056 2.208v5.5h-2.428v-5.5a4.643 4.643 0 0 1 4.643-4.642l.212.004ZM6.857 9.786H3.43a.5.5 0 0 0-.5.5V20.57a.5.5 0 0 0 .5.5h3.428a.5.5 0 0 0 .5-.5V10.286a.5.5 0 0 0-.5-.5Zm-.5 1v9.285H3.929v-9.285h2.428ZM5.143 3.786a2.214 2.214 0 1 0 0 4.428 2.214 2.214 0 0 0 0-4.428Zm0 1a1.214 1.214 0 1 1 0 2.428 1.214 1.214 0 0 1 0-2.428Z"></path></g>`
    		},
    		"twitter": {
    			box: 24,
    			svg: `<path d="M14.09 5.002a4.34 4.34 0 0 0-2.59 4.03v.349l-.109-.003a8.637 8.637 0 0 1-6.696-3.665.5.5 0 0 0-.866.084l-.09.223-.041.109c-.094.255-.187.545-.274.865-.495 1.818-.581 3.73.007 5.537l.092.267c.647 1.766 1.921 3.242 3.905 4.336l.105.056-.158.088a9.477 9.477 0 0 1-4.784 1.08c-.526-.021-.723.68-.262.936 8.374 4.653 17.885-.41 17.885-10.294l-.009-.27a3.62 3.62 0 0 0-.028-.273l-.18.188a7.117 7.117 0 0 0 1.917-3.384.5.5 0 0 0-.774-.527l-.295.2c-.598.386-1.24.7-1.913.932l-.05.016-.081-.08a4.34 4.34 0 0 0-4.509-.882l-.201.082Zm4.27 1.78a.5.5 0 0 0 .521.151l.378-.122c.374-.13.74-.281 1.096-.454l.123-.065-.024.054a6.117 6.117 0 0 1-1.16 1.587.5.5 0 0 0-.14.45c.04.204.06.41.06.619l-.003.285c-.164 8.149-7.352 12.587-14.43 10.03l-.21-.077.197-.03a10.477 10.477 0 0 0 4.084-1.653.5.5 0 0 0-.078-.871c-2.38-1.058-3.78-2.584-4.392-4.465-.52-1.594-.441-3.318.007-4.965l.063-.227.2.225a9.638 9.638 0 0 0 7.361 3.129.5.5 0 0 0 .487-.5v-.857a3.34 3.34 0 0 1 5.86-2.243Z" fill="currentColor" fill-rule="nonzero"></path>`
    		},
    		"reddit": {
    			box: 16,
    			svg: `<path d="M6.167 8a.831.831 0 0 0-.83.83c0 .459.372.84.83.831a.831.831 0 0 0 0-1.661zm1.843 3.647c.315 0 1.403-.038 1.976-.611a.232.232 0 0 0 0-.306.213.213 0 0 0-.306 0c-.353.363-1.126.487-1.67.487-.545 0-1.308-.124-1.671-.487a.213.213 0 0 0-.306 0 .213.213 0 0 0 0 .306c.564.563 1.652.61 1.977.61zm.992-2.807c0 .458.373.83.831.83.458 0 .83-.381.83-.83a.831.831 0 0 0-1.66 0z"/><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.828-1.165c-.315 0-.602.124-.812.325-.801-.573-1.9-.945-3.121-.993l.534-2.501 1.738.372a.83.83 0 1 0 .83-.869.83.83 0 0 0-.744.468l-1.938-.41a.203.203 0 0 0-.153.028.186.186 0 0 0-.086.134l-.592 2.788c-1.24.038-2.358.41-3.17.992-.21-.2-.496-.324-.81-.324a1.163 1.163 0 0 0-.478 2.224c-.02.115-.029.23-.029.353 0 1.795 2.091 3.256 4.669 3.256 2.577 0 4.668-1.451 4.668-3.256 0-.114-.01-.238-.029-.353.401-.181.688-.592.688-1.069 0-.65-.525-1.165-1.165-1.165z"/>`
    		},
    		"copy": {
    			box: 16,
    			svg: `<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>`
    		}
    	};

    	let displayIcon = icons[name];
    	const writable_props = ['name', 'focusable', 'className'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icons> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(3, name = $$props.name);
    		if ('focusable' in $$props) $$invalidate(0, focusable = $$props.focusable);
    		if ('className' in $$props) $$invalidate(1, className = $$props.className);
    	};

    	$$self.$capture_state = () => ({
    		name,
    		focusable,
    		className,
    		icons,
    		displayIcon
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(3, name = $$props.name);
    		if ('focusable' in $$props) $$invalidate(0, focusable = $$props.focusable);
    		if ('className' in $$props) $$invalidate(1, className = $$props.className);
    		if ('icons' in $$props) icons = $$props.icons;
    		if ('displayIcon' in $$props) $$invalidate(2, displayIcon = $$props.displayIcon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [focusable, className, displayIcon, name];
    }

    class Icons extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$S, create_fragment$S, safe_not_equal, { name: 3, focusable: 0, className: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icons",
    			options,
    			id: create_fragment$S.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[3] === undefined && !('name' in props)) {
    			console.warn("<Icons> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<Icons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Icons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<Icons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<Icons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get className() {
    		throw new Error("<Icons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<Icons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/shared/logo.svelte generated by Svelte v3.48.0 */

    const file$L = "src/components/shared/logo.svelte";

    function create_fragment$R(ctx) {
    	let svg;
    	let path0;
    	let path0_fill_value;
    	let path1;
    	let path1_fill_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "id", "Selection");
    			attr_dev(path0, "fill", path0_fill_value = /*color*/ ctx[0] ? '#fb8a8a' : '#c2c2c2');
    			attr_dev(path0, "d", "M 231.00,0.00\n           C 237.83,1.38 249.56,9.21 256.00,12.99\n             256.00,12.99 302.00,39.58 302.00,39.58\n             302.00,39.58 411.00,102.58 411.00,102.58\n             411.00,102.58 445.00,122.15 445.00,122.15\n             450.15,125.09 459.94,130.31 464.00,134.00\n             464.00,134.00 397.00,174.00 397.00,174.00\n             397.00,174.00 352.00,147.58 352.00,147.58\n             352.00,147.58 271.00,100.72 271.00,100.72\n             271.00,100.72 244.00,85.15 244.00,85.15\n             244.00,85.15 231.99,77.37 231.99,77.37\n             231.99,77.37 231.00,70.00 231.00,70.00\n             231.00,70.00 231.00,0.00 231.00,0.00 Z\n           M 231.00,131.00\n           C 231.00,131.00 263.00,148.72 263.00,148.72\n             263.00,148.72 322.00,181.86 322.00,181.86\n             322.00,181.86 351.00,198.00 351.00,198.00\n             351.00,198.00 351.00,200.00 351.00,200.00\n             351.00,200.00 304.00,227.80 304.00,227.80\n             300.08,230.15 287.95,238.22 284.00,237.97\n             281.24,237.80 276.51,234.71 274.00,233.28\n             274.00,233.28 255.00,222.42 255.00,222.42\n             255.00,222.42 239.00,213.28 239.00,213.28\n             237.04,212.16 233.23,210.23 231.99,208.39\n             230.75,206.54 231.00,203.19 231.00,201.00\n             231.00,201.00 231.00,131.00 231.00,131.00 Z\n           M 66.00,171.00\n           C 66.00,171.00 95.00,188.40 95.00,188.40\n             95.00,188.40 113.00,200.00 113.00,200.00\n             113.00,200.00 64.00,228.58 64.00,228.58\n             59.72,231.06 49.60,238.18 45.00,237.25\n             42.44,236.74 33.81,231.45 31.00,229.85\n             23.99,225.85 4.73,215.82 0.00,211.00\n             0.00,211.00 66.00,171.00 66.00,171.00 Z\n           M 113.00,276.00\n           C 113.00,276.00 163.00,246.99 163.00,246.99\n             167.22,244.51 177.35,237.18 182.00,238.20\n             184.12,238.67 193.40,244.36 196.00,245.85\n             196.00,245.85 221.00,260.58 221.00,260.58\n             223.99,262.31 230.30,265.34 231.98,268.21\n             233.21,270.31 233.00,273.61 233.00,276.00\n             233.00,276.00 233.00,346.00 233.00,346.00\n             233.00,346.00 213.00,335.00 213.00,335.00\n             213.00,335.00 183.00,317.42 183.00,317.42\n             183.00,317.42 141.00,292.85 141.00,292.85\n             141.00,292.85 113.00,276.00 113.00,276.00 Z\n           M 352.00,276.00\n           C 352.00,276.00 397.00,249.20 397.00,249.20\n             400.42,247.15 414.18,238.34 417.00,237.97\n             420.66,237.49 426.84,242.25 430.00,244.19\n             437.03,248.50 459.45,261.36 464.00,266.00\n             464.00,266.00 417.00,293.99 417.00,293.99\n             413.03,296.32 402.09,303.69 398.00,303.15\n             395.11,302.77 386.05,297.17 383.00,295.42\n             383.00,295.42 352.00,278.00 352.00,278.00\n             352.00,278.00 352.00,276.00 352.00,276.00 Z\n           M 0.00,343.00\n           C 4.25,338.14 10.51,335.47 16.00,332.20\n             16.00,332.20 49.00,312.99 49.00,312.99\n             52.74,310.79 63.14,303.78 67.00,304.03\n             69.76,304.20 74.49,307.29 77.00,308.72\n             77.00,308.72 97.00,320.28 97.00,320.28\n             97.00,320.28 172.00,363.58 172.00,363.58\n             172.00,363.58 217.00,389.58 217.00,389.58\n             220.58,391.63 230.91,396.74 232.40,400.21\n             233.12,401.89 233.00,405.12 233.00,407.00\n             233.00,407.00 233.00,476.00 233.00,476.00\n             226.41,474.43 211.51,465.08 205.00,461.20\n             205.00,461.20 158.00,434.01 158.00,434.01\n             158.00,434.01 67.00,381.58 67.00,381.58\n             67.00,381.58 0.00,343.00 0.00,343.00 Z");
    			add_location(path0, file$L, 7, 2, 157);
    			attr_dev(path1, "id", "Selection #1");
    			attr_dev(path1, "fill", path1_fill_value = /*color*/ ctx[0] ? '#f95959' : '#a8a8a8');
    			attr_dev(path1, "d", "M 230.00,0.00\n           C 231.80,4.55 231.00,17.47 231.00,23.00\n             231.00,23.00 231.00,71.00 231.00,71.00\n             230.98,80.20 230.98,78.75 216.00,87.28\n             216.00,87.28 178.00,109.28 178.00,109.28\n             178.00,109.28 55.00,180.28 55.00,180.28\n             55.00,180.28 20.00,200.42 20.00,200.42\n             14.02,203.89 6.48,209.11 0.00,211.00\n             0.00,211.00 0.00,141.00 0.00,141.00\n             0.02,131.20 0.60,132.37 15.00,124.15\n             15.00,124.15 54.00,101.60 54.00,101.60\n             54.00,101.60 120.00,63.58 120.00,63.58\n             120.00,63.58 230.00,0.00 230.00,0.00 Z\n           M 230.00,131.00\n           C 231.78,135.49 231.00,147.59 231.00,153.00\n             231.00,153.00 231.00,201.00 231.00,201.00\n             230.98,210.80 230.40,209.63 216.00,217.85\n             216.00,217.85 178.00,239.80 178.00,239.80\n             178.00,239.80 66.00,304.42 66.00,304.42\n             66.00,304.42 0.00,342.00 0.00,342.00\n             0.00,342.00 0.00,273.00 0.00,273.00\n             0.02,262.37 2.80,262.85 15.00,255.85\n             15.00,255.85 55.00,232.72 55.00,232.72\n             55.00,232.72 145.00,180.42 145.00,180.42\n             145.00,180.42 230.00,131.00 230.00,131.00 Z\n           M 463.00,134.00\n           C 464.78,138.49 464.00,150.59 464.00,156.00\n             464.00,156.00 464.00,204.00 464.00,204.00\n             463.98,213.69 463.83,211.89 450.00,220.01\n             450.00,220.01 410.00,243.15 410.00,243.15\n             410.00,243.15 285.00,315.28 285.00,315.28\n             285.00,315.28 256.00,332.01 256.00,332.01\n             256.00,332.01 233.00,345.00 233.00,345.00\n             233.00,345.00 233.00,275.00 233.00,275.00\n             233.02,265.45 233.39,266.59 248.00,258.28\n             248.00,258.28 288.00,235.15 288.00,235.15\n             288.00,235.15 381.00,181.42 381.00,181.42\n             381.00,181.42 463.00,134.00 463.00,134.00 Z\n           M 463.00,264.00\n           C 464.80,268.55 464.00,281.47 464.00,287.00\n             464.00,287.00 464.00,335.00 464.00,335.00\n             463.98,344.55 463.61,343.41 449.00,351.72\n             449.00,351.72 411.00,373.60 411.00,373.60\n             411.00,373.60 297.00,439.42 297.00,439.42\n             297.00,439.42 233.00,476.00 233.00,476.00\n             233.00,476.00 233.00,405.00 233.00,405.00\n             233.02,395.67 232.91,397.59 247.00,389.20\n             247.00,389.20 288.00,365.58 288.00,365.58\n             288.00,365.58 400.00,300.85 400.00,300.85\n             400.00,300.85 463.00,264.00 463.00,264.00 Z");
    			add_location(path1, file$L, 80, 2, 3902);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "6.44444in");
    			attr_dev(svg, "height", "6.61111in");
    			attr_dev(svg, "viewBox", "0 0 464 476");
    			add_location(svg, file$L, 4, 0, 45);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 1 && path0_fill_value !== (path0_fill_value = /*color*/ ctx[0] ? '#fb8a8a' : '#c2c2c2')) {
    				attr_dev(path0, "fill", path0_fill_value);
    			}

    			if (dirty & /*color*/ 1 && path1_fill_value !== (path1_fill_value = /*color*/ ctx[0] ? '#f95959' : '#a8a8a8')) {
    				attr_dev(path1, "fill", path1_fill_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$R.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$R($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Logo', slots, []);
    	let { color = true } = $$props;
    	const writable_props = ['color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Logo> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ color });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color];
    }

    class Logo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$R, create_fragment$R, safe_not_equal, { color: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logo",
    			options,
    			id: create_fragment$R.name
    		});
    	}

    	get color() {
    		throw new Error("<Logo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Logo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const appConfig = {
    	"rootUrl" : "",
    	"refreshRate" : 5, // Minimum time in minutes between refreshing of article lists
    	"permCollections" : ["Read Later", "Already Read"],
    	"defaultOptions" : {
    		"search" : {
    			"sourceCategory" : [],
    			"sortBy" : "publish_date",
    			"sortOrder" : "desc",
    			"firstDate" : null,
    			"lastDate" : null,
    			"searchTerm" : null,
    			"limit" : 100,
    			"highlight" : false
    		},
    		"state" : {
    				"selectedMenu" : {
    					"name" : "News",
    					"type" : "feed",
    				},
    				"representation" : "Large",
    				"localSearch" : ""
    		},
    		"modalState" : {
    				"modalType" : null,
    				"modalContent" : null
    		},
    		"loginState" : {
    				"loggedIn" : false,
    				"userObject" : {}
    		},
    		"modalStates" : {
    			"signup" : {
    				"modalType" : "auth",
    				"modalContent" : {
    					"type" : "signup",
    					"title" : "Hi There!",
    					"desc" : "Sign up below to start your own journey into the wonderful world of CTI"
    				}
    			},
    			"login" : {
    				"modalType" : "auth",
    				"modalContent" : {
    					"type" : "login",
    					"title" : "Welcome back!",
    					"desc" : "Log in down below to continue with your journey into the wonderful world of CTI"
    				}
    			}
    		}
    	},
    	"userOptions" : {
    		"loggedIn" : {
    			"Read Later" : { "icon" : "read-later", "type" : "collection" },
    			"Already Read" : { "icon" : "read-later", "type" : "collection"}//,
    			//"Configure Profile" : { "icon" : "gear", "type" : "userOptions" }
    		}
    	},
    	"feeds" : {
    		"mainFeeds" : {
    			"News" : { "searchQuery" : null, "type" : "feed"},
    			"Today" : { "searchQuery" : {"lastDate" : (new Date()).toISOString(), "firstDate" : (new Date(new Date().getTime() - (24 * 60 * 60 * 1000))).toISOString()}, "type" : "feed", "icon" : "calendar" }
    		},
    		"userFeeds" : {
    			"Log4J" : {
    				"searchQuery" : {
    					"limit" : 200,
    					"sortBy" : "publish_date",
    					"sortOrder" : "desc",
    					"searchTerm" : "log4j",
    					"highlight" : true
    				},
    				"type" : "feed"
    			},
    			"Bitcoin" : {
    				"searchQuery" : {
    					"limit" : 50,
    					"searchTerm" : "bitcoin",
    					"highlight" : false
    				},
    				"type" : "feed"
    			},
    			"Ransomware" : {
    				"searchQuery" : {
    					"limit" : 200,
    					"sortBy" : "publish_date",
    					"sortOrder" : "desc",
    					"searchTerm" : "ransomware",
    					"highlight" : false
    				},
    				"type" : "feed"
    			}
    		}
    	}
    };

    const deepFreeze = (obj) => {
    	Object.keys(obj).forEach((property) => {
    		if (
    			typeof obj[property] === "object" &&
    			!Object.isFrozen(obj[property])
    		)
    		deepFreeze(obj[property]);
    	});
    	return Object.freeze(obj);
    };

    deepFreeze(appConfig);

    const feeds = writable(structuredClone(appConfig.feeds));

    const articles = writable({});

    const state = writable(structuredClone(appConfig.defaultOptions.state));

    const modalState = writable(structuredClone(appConfig.defaultOptions.modalState));

    const loginState = writable(structuredClone(appConfig.defaultOptions.loginState));

    const currentSearch = writable(structuredClone(appConfig.defaultOptions.search));

    const collectionList = writable(null);
    const collectionArticles = writable({});

    /* src/components/sidebar/menuOptions.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1$5 } = globals;
    const file$K = "src/components/sidebar/menuOptions.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (15:3) {#if removeFunction && $loginState.loggedIn}
    function create_if_block$l(ctx) {
    	let button;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icons({
    			props: { className: "remove", name: "x" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			add_location(button, file$K, 15, 4, 942);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					stop_propagation(function () {
    						if (is_function(/*removeFunction*/ ctx[2](/*optionName*/ ctx[8]))) /*removeFunction*/ ctx[2](/*optionName*/ ctx[8]).apply(this, arguments);
    					}),
    					false,
    					false,
    					true
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$l.name,
    		type: "if",
    		source: "(15:3) {#if removeFunction && $loginState.loggedIn}",
    		ctx
    	});

    	return block;
    }

    // (11:1) {#each Object.keys(menuOptions) as optionName }
    function create_each_block$8(ctx) {
    	let li;
    	let icon;
    	let t0;
    	let span;
    	let t1_value = /*optionName*/ ctx[8] + "";
    	let t1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icons({
    			props: {
    				className: "category-icon",
    				name: 'icon' in /*menuOptions*/ ctx[0][/*optionName*/ ctx[8]]
    				? /*menuOptions*/ ctx[0][/*optionName*/ ctx[8]]['icon']
    				: 'feed'
    			},
    			$$inline: true
    		});

    	let if_block = /*removeFunction*/ ctx[2] && /*$loginState*/ ctx[4].loggedIn && create_if_block$l(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*optionName*/ ctx[8]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			if (if_block) if_block.c();
    			attr_dev(span, "class", "svelte-1i704p1");
    			add_location(span, file$K, 13, 3, 862);
    			attr_dev(li, "class", "svelte-1i704p1");

    			toggle_class(li, "selected", /*$state*/ ctx[3].selectedMenu.name == /*optionName*/ ctx[8] && /*$state*/ ctx[3].selectedMenu.type === (/*menuType*/ ctx[1]
    			? /*menuType*/ ctx[1]
    			: /*menuOptions*/ ctx[0][/*optionName*/ ctx[8]].type));

    			add_location(li, file$K, 11, 2, 419);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(icon, li, null);
    			append_dev(li, t0);
    			append_dev(li, span);
    			append_dev(span, t1);
    			append_dev(li, t2);
    			if (if_block) if_block.m(li, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const icon_changes = {};

    			if (dirty & /*menuOptions*/ 1) icon_changes.name = 'icon' in /*menuOptions*/ ctx[0][/*optionName*/ ctx[8]]
    			? /*menuOptions*/ ctx[0][/*optionName*/ ctx[8]]['icon']
    			: 'feed';

    			icon.$set(icon_changes);
    			if ((!current || dirty & /*menuOptions*/ 1) && t1_value !== (t1_value = /*optionName*/ ctx[8] + "")) set_data_dev(t1, t1_value);

    			if (/*removeFunction*/ ctx[2] && /*$loginState*/ ctx[4].loggedIn) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*removeFunction, $loginState*/ 20) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$l(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(li, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*$state, Object, menuOptions, menuType*/ 11) {
    				toggle_class(li, "selected", /*$state*/ ctx[3].selectedMenu.name == /*optionName*/ ctx[8] && /*$state*/ ctx[3].selectedMenu.type === (/*menuType*/ ctx[1]
    				? /*menuType*/ ctx[1]
    				: /*menuOptions*/ ctx[0][/*optionName*/ ctx[8]].type));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(icon);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(11:1) {#each Object.keys(menuOptions) as optionName }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$Q(ctx) {
    	let ul;
    	let t;
    	let current;
    	let each_value = Object.keys(/*menuOptions*/ ctx[0]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(ul, "class", "svelte-1i704p1");

    			toggle_class(ul, "selected", /*$state*/ ctx[3].selectedMenu.name in /*menuOptions*/ ctx[0] && /*$state*/ ctx[3].selectedMenu.type === (/*menuType*/ ctx[1]
    			? /*menuType*/ ctx[1]
    			: /*menuOptions*/ ctx[0][/*$state*/ ctx[3].selectedMenu.name].type));

    			add_location(ul, file$K, 9, 0, 205);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(ul, t);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$state, Object, menuOptions, menuType, removeFunction, $loginState*/ 31) {
    				each_value = Object.keys(/*menuOptions*/ ctx[0]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, t);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*$state, menuOptions, menuType*/ 11) {
    				toggle_class(ul, "selected", /*$state*/ ctx[3].selectedMenu.name in /*menuOptions*/ ctx[0] && /*$state*/ ctx[3].selectedMenu.type === (/*menuType*/ ctx[1]
    				? /*menuType*/ ctx[1]
    				: /*menuOptions*/ ctx[0][/*$state*/ ctx[3].selectedMenu.name].type));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$Q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$Q($$self, $$props, $$invalidate) {
    	let $state;
    	let $loginState;
    	validate_store(state, 'state');
    	component_subscribe($$self, state, $$value => $$invalidate(3, $state = $$value));
    	validate_store(loginState, 'loginState');
    	component_subscribe($$self, loginState, $$value => $$invalidate(4, $loginState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuOptions', slots, ['default']);
    	let { menuOptions } = $$props;
    	let { menuType } = $$props;
    	let { removeFunction = false } = $$props;
    	const writable_props = ['menuOptions', 'menuType', 'removeFunction'];

    	Object_1$5.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MenuOptions> was created with unknown prop '${key}'`);
    	});

    	const click_handler = optionName => {
    		set_store_value(
    			state,
    			$state = {
    				...$state,
    				"selectedMenu": {
    					"name": optionName,
    					"type": menuType ? menuType : menuOptions[optionName].type
    				},
    				"localSearch": ""
    			},
    			$state
    		);
    	};

    	$$self.$$set = $$props => {
    		if ('menuOptions' in $$props) $$invalidate(0, menuOptions = $$props.menuOptions);
    		if ('menuType' in $$props) $$invalidate(1, menuType = $$props.menuType);
    		if ('removeFunction' in $$props) $$invalidate(2, removeFunction = $$props.removeFunction);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		menuOptions,
    		menuType,
    		removeFunction,
    		Icon: Icons,
    		state,
    		loginState,
    		$state,
    		$loginState
    	});

    	$$self.$inject_state = $$props => {
    		if ('menuOptions' in $$props) $$invalidate(0, menuOptions = $$props.menuOptions);
    		if ('menuType' in $$props) $$invalidate(1, menuType = $$props.menuType);
    		if ('removeFunction' in $$props) $$invalidate(2, removeFunction = $$props.removeFunction);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		menuOptions,
    		menuType,
    		removeFunction,
    		$state,
    		$loginState,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class MenuOptions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$Q, create_fragment$Q, safe_not_equal, {
    			menuOptions: 0,
    			menuType: 1,
    			removeFunction: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuOptions",
    			options,
    			id: create_fragment$Q.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*menuOptions*/ ctx[0] === undefined && !('menuOptions' in props)) {
    			console.warn("<MenuOptions> was created without expected prop 'menuOptions'");
    		}

    		if (/*menuType*/ ctx[1] === undefined && !('menuType' in props)) {
    			console.warn("<MenuOptions> was created without expected prop 'menuType'");
    		}
    	}

    	get menuOptions() {
    		throw new Error("<MenuOptions>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuOptions(value) {
    		throw new Error("<MenuOptions>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menuType() {
    		throw new Error("<MenuOptions>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuType(value) {
    		throw new Error("<MenuOptions>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removeFunction() {
    		throw new Error("<MenuOptions>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set removeFunction(value) {
    		throw new Error("<MenuOptions>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/shared/collapseArrow.svelte generated by Svelte v3.48.0 */
    const file$J = "src/components/shared/collapseArrow.svelte";

    function create_fragment$P(ctx) {
    	let button;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icons({
    			props: {
    				name: "arrow",
    				className: /*open*/ ctx[0] ? "open" : ""
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			attr_dev(button, "class", "collapse svelte-hsejcv");
    			add_location(button, file$J, 5, 0, 73);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const icon_changes = {};
    			if (dirty & /*open*/ 1) icon_changes.className = /*open*/ ctx[0] ? "open" : "";
    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$P.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$P($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CollapseArrow', slots, []);
    	let { open } = $$props;
    	const writable_props = ['open'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CollapseArrow> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, open = !open);

    	$$self.$$set = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    	};

    	$$self.$capture_state = () => ({ open, Icon: Icons });

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [open, click_handler];
    }

    class CollapseArrow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$P, create_fragment$P, safe_not_equal, { open: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CollapseArrow",
    			options,
    			id: create_fragment$P.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*open*/ ctx[0] === undefined && !('open' in props)) {
    			console.warn("<CollapseArrow> was created without expected prop 'open'");
    		}
    	}

    	get open() {
    		throw new Error("<CollapseArrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<CollapseArrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/sidebar/menu.svelte generated by Svelte v3.48.0 */
    const file$I = "src/components/sidebar/menu.svelte";

    // (15:0) {#if title}
    function create_if_block_1$7(ctx) {
    	let div;
    	let h3;
    	let t0;
    	let t1;
    	let collapse;
    	let updating_open;
    	let current;

    	function collapse_open_binding(value) {
    		/*collapse_open_binding*/ ctx[6](value);
    	}

    	let collapse_props = {};

    	if (/*open*/ ctx[4] !== void 0) {
    		collapse_props.open = /*open*/ ctx[4];
    	}

    	collapse = new CollapseArrow({ props: collapse_props, $$inline: true });
    	binding_callbacks.push(() => bind(collapse, 'open', collapse_open_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			create_component(collapse.$$.fragment);
    			attr_dev(h3, "class", "svelte-i01mcz");
    			add_location(h3, file$I, 16, 1, 328);
    			attr_dev(div, "class", "seperator svelte-i01mcz");
    			add_location(div, file$I, 15, 0, 303);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(div, t1);
    			mount_component(collapse, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			const collapse_changes = {};

    			if (!updating_open && dirty & /*open*/ 16) {
    				updating_open = true;
    				collapse_changes.open = /*open*/ ctx[4];
    				add_flush_callback(() => updating_open = false);
    			}

    			collapse.$set(collapse_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(collapse.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(collapse.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(collapse);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(15:0) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (21:0) {#if open}
    function create_if_block$k(ctx) {
    	let div;
    	let optionlist;
    	let div_transition;
    	let current;

    	optionlist = new MenuOptions({
    			props: {
    				menuOptions: /*menuOptions*/ ctx[1],
    				menuType: /*menuType*/ ctx[2],
    				removeFunction: /*removeFunction*/ ctx[3],
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(optionlist.$$.fragment);
    			add_location(div, file$I, 21, 0, 395);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(optionlist, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const optionlist_changes = {};
    			if (dirty & /*menuOptions*/ 2) optionlist_changes.menuOptions = /*menuOptions*/ ctx[1];
    			if (dirty & /*menuType*/ 4) optionlist_changes.menuType = /*menuType*/ ctx[2];
    			if (dirty & /*removeFunction*/ 8) optionlist_changes.removeFunction = /*removeFunction*/ ctx[3];

    			if (dirty & /*$$scope*/ 128) {
    				optionlist_changes.$$scope = { dirty, ctx };
    			}

    			optionlist.$set(optionlist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(optionlist.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(optionlist.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(optionlist);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$k.name,
    		type: "if",
    		source: "(21:0) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (23:0) <OptionList  {menuOptions} {menuType} {removeFunction}>
    function create_default_slot$a(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(23:0) <OptionList  {menuOptions} {menuType} {removeFunction}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$O(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*title*/ ctx[0] && create_if_block_1$7(ctx);
    	let if_block1 = /*open*/ ctx[4] && create_if_block$k(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*title*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$7(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*open*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*open*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$k(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$O.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$O($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, ['default']);
    	let { title = "" } = $$props;
    	let { menuOptions = {} } = $$props;
    	let { menuType = "" } = $$props;
    	let { removeFunction } = $$props;
    	let open = true;
    	const writable_props = ['title', 'menuOptions', 'menuType', 'removeFunction'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	function collapse_open_binding(value) {
    		open = value;
    		$$invalidate(4, open);
    	}

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('menuOptions' in $$props) $$invalidate(1, menuOptions = $$props.menuOptions);
    		if ('menuType' in $$props) $$invalidate(2, menuType = $$props.menuType);
    		if ('removeFunction' in $$props) $$invalidate(3, removeFunction = $$props.removeFunction);
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		menuOptions,
    		menuType,
    		removeFunction,
    		open,
    		slide,
    		OptionList: MenuOptions,
    		Collapse: CollapseArrow
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('menuOptions' in $$props) $$invalidate(1, menuOptions = $$props.menuOptions);
    		if ('menuType' in $$props) $$invalidate(2, menuType = $$props.menuType);
    		if ('removeFunction' in $$props) $$invalidate(3, removeFunction = $$props.removeFunction);
    		if ('open' in $$props) $$invalidate(4, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		title,
    		menuOptions,
    		menuType,
    		removeFunction,
    		open,
    		slots,
    		collapse_open_binding,
    		$$scope
    	];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$O, create_fragment$O, safe_not_equal, {
    			title: 0,
    			menuOptions: 1,
    			menuType: 2,
    			removeFunction: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$O.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*removeFunction*/ ctx[3] === undefined && !('removeFunction' in props)) {
    			console.warn("<Menu> was created without expected prop 'removeFunction'");
    		}
    	}

    	get title() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menuOptions() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuOptions(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menuType() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuType(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removeFunction() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set removeFunction(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const storeOverview = {
    	"feeds" : {"store" : feeds, "defaultValue" : structuredClone(appConfig.feeds)},
    	"state" : {"store" : state, "defaultValue" : structuredClone(appConfig.defaultOptions.state)},
    	"modalState" : {"store" : modalState, "defaultValue" : structuredClone(appConfig.defaultOptions.modalState)},
    	"loginState" : {"store" : loginState, "defaultValue" : structuredClone(appConfig.defaultOptions.loginState)},
    	"currentSearch" : {"store" : currentSearch, "defaultValue" : structuredClone(appConfig.defaultOptions.search)},
    	"collectionList" : {"store" : collectionList, "defaultValue" : null},
    	"collectionArticles" : {"store" : collectionArticles, "defaultValue" : {}},
    };

    function showSearchModal() {
    	modalState.set({"modalType" : "search", "modalContent" : null});
    	document.activeElement.blur();
    }

    async function resetState() {
    	for (const storeDetails of Object.values(storeOverview)) {
    		storeDetails.store.set(storeDetails.defaultValue);
    	}
    }

    async function syncStateToLocalStorage(includeStores = false) {
    	let unsubscribeFunctions = [];

    	for (const storeName of Object.keys(storeOverview)) {
    		if (Array.isArray(includeStores) && includeStores.includes(storeName)) {
    			unsubscribeFunctions.push(
    				storeOverview[storeName].store.subscribe((value) => localStorage.setItem(storeName, JSON.stringify(value)))
    			);
    		}
    	}

    	return () => { unsubscribeFunctions.forEach(funcName => funcName());}
    }

    async function syncLocalStorageToState(includeStores = false) {
    	for (const storeName of Object.keys(storeOverview)) {
    		if (Array.isArray(includeStores) && includeStores.includes(storeName)) {
    			const currentValue = localStorage.getItem(storeName);

    			if (Boolean(currentValue)) {
    				try {
    					storeOverview[storeName].store.set(JSON.parse(currentValue));
    				} catch (e) {
    					console.log(`Failed to read state details regarding "${storeName}", with the following value and error. Clearing it for now.`, currentValue, e);
    					localStorage.removeItem(storeName);
    				}
    			}
    		}
    	}
    }

    async function queryProtected(queryURL, method = "GET", body = null) {
    	let headers;

    	headers = {
    		credentials : "include",
    		method : method,
    		headers: {'Content-Type': 'application/json'},
    		body : body ? JSON.stringify(body) : null
    	};

    	let queryResult = await fetch(`${appConfig.rootUrl}${queryURL}`, headers);

    	if (queryResult.status == 401) {
    		return {"status" : "not-auth", "content" : "User needs to be logged in to access this feature"}
    	} else {
    		loginState.update(currentState => {
    			currentState.loggedIn = true;
    			return currentState
    		});

    		try {
    			if (queryResult.ok) {
    				return {"status" : "success", "content" : await queryResult.json()}
    			} else {
    				console.log("Error in query: ", queryResult);
    				return {"status" : "failure", "content" : (await queryResult.json())["detail"] }
    			}
    		} catch {
    			return {"status" : "failure", "content" : "An unexpected error occured, please try again"}
    		}
    	}
    }

    async function changeOnlineState(URL, method, content, action, handleSuccessMethod) {
    	let newState = await queryProtected(URL, method, content);

    	if (newState.status === "success") {
    		await handleSuccessMethod(newState.content);
    	} else {
    		console.log(`Failed to ${action}, with following error: `, newState.content);
    	}

    }

    function getHeaders(username, password, params = {}) {
    	return {
    		credentials : "include",
    		method : "POST",
    		headers : {
    			"Content-Type" : "application/x-www-form-urlencoded"
    		},
    		body : new URLSearchParams({
    			"username" : username,
    			"password" : password,
    			...params
    		})
    	}
    }

    async function signup(username, password) {
    	let queryResult = await fetch(`${appConfig.rootUrl}/auth/signup`, getHeaders(username, password));
    	return queryResult.ok ? true : queryResult
    }

    async function login(username, password, remember_me = false) {

    	let queryResult = await fetch(`${appConfig.rootUrl}/auth/login?remember_me=${remember_me}`, getHeaders(username, password));

    	if (queryResult.ok) {
    		loginState.set({
    			"loggedIn" : true,
    			"userObject" : await queryResult.json()
    		});

    		return true
    	} else {
    		return queryResult
    	}
    }


    async function logout() {
    	await queryProtected("/auth/logout", "POST");
    	resetState();
    }

    async function insertFeeds(feedSpecs) {

    	let newFeeds = Object.fromEntries(feedSpecs.map(feed => { return [feed.feed_name, {"searchQuery" : feed, "type" : "feed"}] }) );

    	feeds.update(userFeeds => {
    		userFeeds.userFeeds = newFeeds;
    		return userFeeds
    	});
    }

    async function getUserFeeds() {
    	let currentFeeds = await queryProtected("/users/feeds/list");

    	if (currentFeeds.status === "success") {
    		await insertFeeds(currentFeeds.content);
    	} else {
    		console.log("Failed to get user feeds, with following error: ", currentFeeds.content);
    	}
    }

    async function createFeed(feedSpecs) {
    	changeOnlineState("/users/feeds/create", "POST", feedSpecs, `create "${feedSpecs.feed_name}" feed`, insertFeeds);
    }

    async function removeFeed(feedName) {
    	changeOnlineState(`/users/feeds/remove?feed_name=${encodeURIComponent(feedName)}`, "DELETE", null, `remove "${feedName}" feed`, insertFeeds);
    }

    async function getFeedNames(feeds) {
    	return Array.from(Object.values(feeds), (category) => Object.keys(category)).flat()
    }

    async function queryAPI(queryURL, defaultResponse = null) {
    	let queryResult = await fetch(`${appConfig.rootUrl}${queryURL}`);

    	if (queryResult.ok) {
    		return await queryResult.json()
    	} else {
    		return defaultResponse
    	}
    }

    async function getArticleCategories() {
    	return queryAPI("/articles/categories", {})
    }

    async function getArticleContent(articleID) {
    	return queryAPI(`/articles/content?IDs=${articleID}`, [{}])
    }

    async function refreshArticles(currentFeeds) {
    	for (const feedType of Object.keys(currentFeeds)) {
    		for (let [feedName, feedDetails] of Object.entries(currentFeeds[feedType])) {
    			updateArticleListing(articles, feedName, feedDetails["searchQuery"]);
    		}
    	}
    }

    async function updateArticleListing(articleList, sourceName, sourceSpecs) {
    	let currentArticleList = get_store_value(articleList);

    	if (sourceName in currentArticleList) {
    		if ((Date.now() - currentArticleList[sourceName].time) / 60000 > appConfig.refreshRate || sourceSpecs != currentArticleList[sourceName]["sourceSpecs"]) {
    			await fetchArticles(articleList, sourceName, sourceSpecs);
    		}
    	} else {
    		await fetchArticles(articleList, sourceName, sourceSpecs);
    	}
    }

    async function fetchArticles(articleContainer, sourceName, sourceSpecs = null){
    	let fetchedArticles;

    	if (typeof sourceSpecs === "object" && !Array.isArray(sourceSpecs) && sourceSpecs !== null) {
    		const queryString = Object.keys(sourceSpecs)
    			.filter(key => sourceSpecs[key])
    			.map(key => `${key}=` + (	Array.isArray(sourceSpecs[key])
    										? sourceSpecs[key].map(value => encodeURIComponent(value)).join(`&${key}=`)
    										: encodeURIComponent(sourceSpecs[key])
    									)
    			).join('&');

    		fetchedArticles = await queryAPI(`/articles/overview/search?${queryString}`);
    	} else if (Array.isArray(sourceSpecs)) {
    		if (sourceSpecs.length > 0) {
    			// Using slice to limit the amount of articles requested, since there's an upper limit to the length of an URL
    			const IDQuery = `IDs=${sourceSpecs.slice(0, 100).map(ID => encodeURIComponent(ID)).join("&IDs=")}`;
    			fetchedArticles = await queryAPI(`/articles/overview/search?${IDQuery}`);
    		} else {
    			fetchedArticles = [];
    		}
    	} else {
    		fetchedArticles = await queryAPI(`/articles/overview/newest`);
    	}

    	articleContainer.update((currentArticles) => { currentArticles[sourceName] = {"sourceSpecs" : sourceSpecs, "articles" : fetchedArticles, "time" : Date.now()}; return currentArticles});
    }

    async function updateCollectionStores(data) {
    	if (data) {
    		await collectionList.set(data);
    	}
    }

    async function getUserCollections(collectionName = null) {
    	let currentCollections = await queryProtected("/users/collections/list");

    	if (currentCollections.status === "success") {
    		await updateCollectionStores(currentCollections.content);

    		if (collectionName && collectionName in currentCollections.content) {
    			await updateArticleListing(collectionArticles, collectionName, currentCollections.content[collectionName]);
    		}
    	} else {
    		console.log("Failed to get user collections, with following error: ", currentCollections.content);
    	}
    }

    async function modifyCollection(collectionName, mod_action, IDs) {
    	let queryUrl;

    	if (Array.isArray(IDs)) {
    		queryUrl = "?IDs=" + IDs.map(ID => encodeURIComponent(ID)).join("&IDs=");
    	} else if (IDs) {
    		queryUrl = `?IDs=${encodeURIComponent(IDs)}`;
    	} else {
    		return
    	}

    	await changeOnlineState(`/users/collections/modify/${encodeURIComponent(collectionName)}/${encodeURIComponent(mod_action)}${queryUrl}`, "POST", null, `modify "${collectionName}" collection`, updateCollectionStores);
    }

    async function createCollection(collectionName) {
    	await changeOnlineState(`/users/collections/create/${encodeURIComponent(collectionName)}`, "POST", null, `create "${collectionName}" collection`, updateCollectionStores);
    }

    async function removeCollection(collectionName) {
    	await changeOnlineState(`/users/collections/remove/${encodeURIComponent(collectionName)}`, "DELETE", null, `remove "${collectionName}" collection`, updateCollectionStores);
    }

    /* src/components/sidebar/main.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1$4, window: window_1 } = globals;
    const file$H = "src/components/sidebar/main.svelte";

    // (77:0) {#if open}
    function create_if_block$j(ctx) {
    	let aside;
    	let div;
    	let logo;
    	let h2;
    	let t1;
    	let button;
    	let icon;
    	let t2;
    	let span;

    	let t3_value = (/*$state*/ ctx[5].selectedMenu.type === "search"
    	? "Exploring Content"
    	: "Explore Content") + "";

    	let t3;
    	let t4;
    	let nav;
    	let menu0;
    	let t5;
    	let menu1;
    	let t6;
    	let current_block_type_index;
    	let if_block;
    	let aside_transition;
    	let current;
    	let mounted;
    	let dispose;
    	logo = new Logo({ $$inline: true });

    	icon = new Icons({
    			props: { name: "magnifying-glass" },
    			$$inline: true
    		});

    	menu0 = new Menu({
    			props: { menuOptions: /*$feeds*/ ctx[4].mainFeeds },
    			$$inline: true
    		});

    	menu1 = new Menu({
    			props: {
    				title: "feeds",
    				menuOptions: /*$feeds*/ ctx[4].userFeeds,
    				removeFunction: removeFeed,
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block_1$6, create_else_block$a];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$loginState*/ ctx[3].loggedIn) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			div = element("div");
    			create_component(logo.$$.fragment);
    			h2 = element("h2");
    			h2.textContent = "OSINTer";
    			t1 = space();
    			button = element("button");
    			create_component(icon.$$.fragment);
    			t2 = space();
    			span = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			nav = element("nav");
    			create_component(menu0.$$.fragment);
    			t5 = space();
    			create_component(menu1.$$.fragment);
    			t6 = space();
    			if_block.c();
    			attr_dev(h2, "class", "svelte-1wlh0o9");
    			add_location(h2, file$H, 78, 29, 2923);
    			attr_dev(div, "id", "logo-space");
    			attr_dev(div, "class", "svelte-1wlh0o9");
    			add_location(div, file$H, 78, 1, 2895);
    			attr_dev(span, "class", "svelte-1wlh0o9");
    			add_location(span, file$H, 80, 144, 3091);
    			attr_dev(button, "class", "long-button svelte-1wlh0o9");
    			toggle_class(button, "selected", /*$state*/ ctx[5].selectedMenu.type === "search");
    			add_location(button, file$H, 80, 1, 2948);
    			attr_dev(nav, "class", "svelte-1wlh0o9");
    			add_location(nav, file$H, 82, 1, 3200);
    			attr_dev(aside, "id", "navbar");
    			attr_dev(aside, "class", "svelte-1wlh0o9");
    			add_location(aside, file$H, 77, 0, 2826);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			append_dev(aside, div);
    			mount_component(logo, div, null);
    			append_dev(div, h2);
    			append_dev(aside, t1);
    			append_dev(aside, button);
    			mount_component(icon, button, null);
    			append_dev(button, t2);
    			append_dev(button, span);
    			append_dev(span, t3);
    			append_dev(aside, t4);
    			append_dev(aside, nav);
    			mount_component(menu0, nav, null);
    			append_dev(nav, t5);
    			mount_component(menu1, nav, null);
    			append_dev(nav, t6);
    			if_blocks[current_block_type_index].m(nav, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", showSearchModal, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$state*/ 32) && t3_value !== (t3_value = (/*$state*/ ctx[5].selectedMenu.type === "search"
    			? "Exploring Content"
    			: "Explore Content") + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*$state*/ 32) {
    				toggle_class(button, "selected", /*$state*/ ctx[5].selectedMenu.type === "search");
    			}

    			const menu0_changes = {};
    			if (dirty & /*$feeds*/ 16) menu0_changes.menuOptions = /*$feeds*/ ctx[4].mainFeeds;
    			menu0.$set(menu0_changes);
    			const menu1_changes = {};
    			if (dirty & /*$feeds*/ 16) menu1_changes.menuOptions = /*$feeds*/ ctx[4].userFeeds;

    			if (dirty & /*$$scope, $state*/ 32800) {
    				menu1_changes.$$scope = { dirty, ctx };
    			}

    			menu1.$set(menu1_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(nav, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			transition_in(icon.$$.fragment, local);
    			transition_in(menu0.$$.fragment, local);
    			transition_in(menu1.$$.fragment, local);
    			transition_in(if_block);

    			if (local) {
    				add_render_callback(() => {
    					if (!aside_transition) aside_transition = create_bidirectional_transition(aside, fly, { x: -50, duration: 150 }, true);
    					aside_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			transition_out(icon.$$.fragment, local);
    			transition_out(menu0.$$.fragment, local);
    			transition_out(menu1.$$.fragment, local);
    			transition_out(if_block);

    			if (local) {
    				if (!aside_transition) aside_transition = create_bidirectional_transition(aside, fly, { x: -50, duration: 150 }, false);
    				aside_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			destroy_component(logo);
    			destroy_component(icon);
    			destroy_component(menu0);
    			destroy_component(menu1);
    			if_blocks[current_block_type_index].d();
    			if (detaching && aside_transition) aside_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$j.name,
    		type: "if",
    		source: "(77:0) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (85:2) <Menu title="feeds" menuOptions={$feeds.userFeeds} removeFunction="{removeFeed}">
    function create_default_slot_3$2(ctx) {
    	let li;
    	let icon;
    	let span;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icons({
    			props: { className: "category-icon", name: "plus" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(icon.$$.fragment);
    			span = element("span");
    			span.textContent = "New Feed";
    			add_location(span, file$H, 85, 129, 3463);
    			attr_dev(li, "class", "svelte-1wlh0o9");
    			toggle_class(li, "click-able", /*$state*/ ctx[5].selectedMenu.type == "search");
    			add_location(li, file$H, 85, 3, 3337);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(icon, li, null);
    			append_dev(li, span);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(li, "click", /*addFeed*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$state*/ 32) {
    				toggle_class(li, "click-able", /*$state*/ ctx[5].selectedMenu.type == "search");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(85:2) <Menu title=\\\"feeds\\\" menuOptions={$feeds.userFeeds} removeFunction=\\\"{removeFeed}\\\">",
    		ctx
    	});

    	return block;
    }

    // (96:2) {:else}
    function create_else_block$a(ctx) {
    	let menu;
    	let current;

    	menu = new Menu({
    			props: {
    				title: "User",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(menu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menu_changes = {};

    			if (dirty & /*$$scope, $modalState*/ 32772) {
    				menu_changes.$$scope = { dirty, ctx };
    			}

    			menu.$set(menu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$a.name,
    		type: "else",
    		source: "(96:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (89:2) {#if $loginState.loggedIn }
    function create_if_block_1$6(ctx) {
    	let menu0;
    	let t;
    	let menu1;
    	let current;

    	menu0 = new Menu({
    			props: {
    				title: "Collections",
    				menuOptions: /*userCollections*/ ctx[1],
    				menuType: "collection",
    				removeFunction: removeCollection,
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	menu1 = new Menu({
    			props: {
    				title: "User",
    				menuOptions: appConfig.userOptions.loggedIn,
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(menu0.$$.fragment);
    			t = space();
    			create_component(menu1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menu0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(menu1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menu0_changes = {};
    			if (dirty & /*userCollections*/ 2) menu0_changes.menuOptions = /*userCollections*/ ctx[1];

    			if (dirty & /*$$scope*/ 32768) {
    				menu0_changes.$$scope = { dirty, ctx };
    			}

    			menu0.$set(menu0_changes);
    			const menu1_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				menu1_changes.$$scope = { dirty, ctx };
    			}

    			menu1.$set(menu1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu0.$$.fragment, local);
    			transition_in(menu1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu0.$$.fragment, local);
    			transition_out(menu1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menu0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(menu1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(89:2) {#if $loginState.loggedIn }",
    		ctx
    	});

    	return block;
    }

    // (97:3) <Menu title="User">
    function create_default_slot_2$3(ctx) {
    	let li;
    	let icon;
    	let span;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icons({
    			props: {
    				className: "category-icon",
    				name: "logout"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(icon.$$.fragment);
    			span = element("span");
    			span.textContent = "Login";
    			add_location(span, file$H, 97, 166, 4185);
    			attr_dev(li, "class", "click-able svelte-1wlh0o9");
    			add_location(li, file$H, 97, 4, 4023);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(icon, li, null);
    			append_dev(li, span);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(li, "click", /*click_handler*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(97:3) <Menu title=\\\"User\\\">",
    		ctx
    	});

    	return block;
    }

    // (90:3) <Menu title="Collections" menuOptions={userCollections} menuType="collection" removeFunction="{removeCollection}">
    function create_default_slot_1$3(ctx) {
    	let li;
    	let icon;
    	let span;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icons({
    			props: { className: "category-icon", name: "plus" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(icon.$$.fragment);
    			span = element("span");
    			span.textContent = "New Collection";
    			add_location(span, file$H, 90, 97, 3746);
    			attr_dev(li, "class", "click-able svelte-1wlh0o9");
    			add_location(li, file$H, 90, 4, 3653);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(icon, li, null);
    			append_dev(li, span);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(li, "click", /*addCollection*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(90:3) <Menu title=\\\"Collections\\\" menuOptions={userCollections} menuType=\\\"collection\\\" removeFunction=\\\"{removeCollection}\\\">",
    		ctx
    	});

    	return block;
    }

    // (93:3) <Menu title="User" menuOptions={appConfig.userOptions.loggedIn}>
    function create_default_slot$9(ctx) {
    	let li;
    	let icon;
    	let span;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icons({
    			props: {
    				className: "category-icon",
    				name: "logout"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(icon.$$.fragment);
    			span = element("span");
    			span.textContent = "Logout";
    			add_location(span, file$H, 93, 92, 3950);
    			attr_dev(li, "class", "click-able svelte-1wlh0o9");
    			add_location(li, file$H, 93, 4, 3862);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(icon, li, null);
    			append_dev(li, span);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(li, "click", logout, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(93:3) <Menu title=\\\"User\\\" menuOptions={appConfig.userOptions.loggedIn}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$N(ctx) {
    	let t;
    	let button;
    	let icon;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*open*/ ctx[0] && create_if_block$j(ctx);

    	icon = new Icons({
    			props: { name: "arrow-down-right-square" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			button = element("button");
    			create_component(icon.$$.fragment);
    			attr_dev(button, "class", button_class_value = "control-open " + (/*open*/ ctx[0] ? 'open' : '') + " svelte-1wlh0o9");
    			add_location(button, file$H, 106, 0, 4254);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "keydown", /*keydown_handler*/ ctx[8], false, false, false),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*open*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*open*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$j(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*open*/ 1 && button_class_value !== (button_class_value = "control-open " + (/*open*/ ctx[0] ? 'open' : '') + " svelte-1wlh0o9")) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$N.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$N($$self, $$props, $$invalidate) {
    	let $modalState;
    	let $collectionList;
    	let $loginState;
    	let $feeds;
    	let $state;
    	let $currentSearch;
    	validate_store(modalState, 'modalState');
    	component_subscribe($$self, modalState, $$value => $$invalidate(2, $modalState = $$value));
    	validate_store(collectionList, 'collectionList');
    	component_subscribe($$self, collectionList, $$value => $$invalidate(11, $collectionList = $$value));
    	validate_store(loginState, 'loginState');
    	component_subscribe($$self, loginState, $$value => $$invalidate(3, $loginState = $$value));
    	validate_store(feeds, 'feeds');
    	component_subscribe($$self, feeds, $$value => $$invalidate(4, $feeds = $$value));
    	validate_store(state, 'state');
    	component_subscribe($$self, state, $$value => $$invalidate(5, $state = $$value));
    	validate_store(currentSearch, 'currentSearch');
    	component_subscribe($$self, currentSearch, $$value => $$invalidate(12, $currentSearch = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main', slots, []);
    	let open = true;

    	async function createFeedFromSearch(feedName) {
    		let feedSpecs = $currentSearch;
    		feedSpecs.feed_name = feedName;
    		await createFeed(feedSpecs);
    		set_store_value(modalState, $modalState = { "modalType": null, "modalContent": null }, $modalState);

    		set_store_value(
    			state,
    			$state = {
    				...$state,
    				"selectedMenu": { "name": feedName, "type": "feed" },
    				"localSearch": ""
    			},
    			$state
    		);
    	}

    	async function addFeed() {
    		await getUserFeeds();

    		if ($loginState.loggedIn) {
    			if ($state.selectedMenu.type == "search") {
    				set_store_value(
    					modalState,
    					$modalState = {
    						"modalType": "getName",
    						"modalContent": {
    							"userAction": "New feed name",
    							"action": createFeedFromSearch,
    							"existingNames": await getFeedNames($feeds)
    						}
    					},
    					$modalState
    				);
    			} else {
    				showSearchModal();
    			}
    		} else {
    			set_store_value(
    				modalState,
    				$modalState = {
    					"modalType": "auth",
    					"modalContent": {
    						"type": "login",
    						"title": "Login here",
    						"desc": "Login here or signup with the link down below to create custom feeds."
    					}
    				},
    				$modalState
    			);
    		}
    	}

    	async function addCollection() {
    		getUserCollections();

    		if ($loginState.loggedIn) {
    			set_store_value(
    				modalState,
    				$modalState = {
    					"modalType": "getName",
    					"modalContent": {
    						"userAction": "New collection name",
    						"action": async feedName => {
    							await createCollection(feedName);
    							set_store_value(modalState, $modalState = { "modalType": null, "modalContent": null }, $modalState);
    						},
    						"existingNames": Object.keys($collectionList)
    					}
    				},
    				$modalState
    			);
    		} else {
    			set_store_value(
    				modalState,
    				$modalState = {
    					"modalType": "auth",
    					"modalContent": {
    						"type": "login",
    						"title": "Login here",
    						"desc": "Login here or signup with the link down below to create collections."
    					}
    				},
    				$modalState
    			);
    		}
    	}

    	let userCollections = {};

    	const collectionListUnsubscribed = collectionList.subscribe(collectionList => {
    		if (collectionList && Object.keys(collectionList).length > 1) {
    			$$invalidate(1, userCollections = Object.fromEntries(Object.entries(collectionList).filter(([key, value]) => !appConfig.permCollections.includes(key))));
    		} else {
    			$$invalidate(1, userCollections = {});
    		}
    	});

    	onDestroy(collectionListUnsubscribed);

    	window.matchMedia('(min-width: 70rem)').addListener(() => {
    		$$invalidate(0, open = true);
    	});

    	window.matchMedia('(max-width: 60rem)').addListener(() => {
    		$$invalidate(0, open = false);
    	});

    	const writable_props = [];

    	Object_1$4.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	const keydown_handler = e => {
    		if (e.key === "ArrowLeft") {
    			$$invalidate(0, open = false);
    		} else if (e.key === "ArrowRight") {
    			$$invalidate(0, open = true);
    		}
    	};

    	const click_handler = () => set_store_value(modalState, $modalState = structuredClone(appConfig.defaultOptions.modalStates.login), $modalState);

    	const click_handler_1 = () => {
    		document.activeElement.blur();
    		$$invalidate(0, open = !open);
    	};

    	$$self.$capture_state = () => ({
    		Icon: Icons,
    		Logo,
    		Menu,
    		feeds,
    		state,
    		modalState,
    		loginState,
    		collectionList,
    		currentSearch,
    		appConfig,
    		showSearchModal,
    		logout,
    		createFeed,
    		getUserFeeds,
    		getFeedNames,
    		removeFeed,
    		getUserCollections,
    		createCollection,
    		removeCollection,
    		onDestroy,
    		fly,
    		slide,
    		open,
    		createFeedFromSearch,
    		addFeed,
    		addCollection,
    		userCollections,
    		collectionListUnsubscribed,
    		$modalState,
    		$collectionList,
    		$loginState,
    		$feeds,
    		$state,
    		$currentSearch
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('userCollections' in $$props) $$invalidate(1, userCollections = $$props.userCollections);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		open,
    		userCollections,
    		$modalState,
    		$loginState,
    		$feeds,
    		$state,
    		addFeed,
    		addCollection,
    		keydown_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class Main$3 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$N, create_fragment$N, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$N.name
    		});
    	}
    }

    function search(searchQuery) {
    	if (searchQuery) {

    		// Remove values that are null or empty, as those can be problematic when calling the API
    		Object.keys(searchQuery).forEach((k) => {
    			if (!searchQuery[k] || searchQuery[k].length === 0) delete searchQuery[k];
    			if (k.toLowerCase().includes("date") && searchQuery[k]) {
    				searchQuery[k] = (new Date(searchQuery[k])).toISOString();
    			}
    		});

    		feeds.update(currentFeeds => {
    			currentFeeds["newFeed"] = {"Custom search" : { "searchQuery" : { "limit" : appConfig.defaultOptions.search.limit, ...searchQuery } } };

    			return currentFeeds
    		});

    		state.update(currentState => {
    			currentState.selectedMenu = {"name" : "Custom search", "type" : "search"};
    			currentState.localSearch = "";
    			return currentState
    		});

    		modalState.set({ "modalType" : null, "modalContent" : null });
    	}
    }

    /* src/components/search_fields.svelte generated by Svelte v3.48.0 */
    const file$G = "src/components/search_fields.svelte";

    // (16:1) {#if $state.localSearch}
    function create_if_block$i(ctx) {
    	let button;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;
    	icon = new Icons({ props: { name: "x" }, $$inline: true });

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "svelte-1v45dx1");
    			add_location(button, file$G, 15, 25, 522);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", prevent_default(/*click_handler*/ ctx[3]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(16:1) {#if $state.localSearch}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$M(ctx) {
    	let form;
    	let label;
    	let icon;
    	let t0;
    	let input;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icons({
    			props: { name: "magnifying-glass" },
    			$$inline: true
    		});

    	let if_block = /*$state*/ ctx[0].localSearch && create_if_block$i(ctx);

    	const block = {
    		c: function create() {
    			form = element("form");
    			label = element("label");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			input = element("input");
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(label, "for", "search-field");
    			attr_dev(label, "class", "svelte-1v45dx1");
    			add_location(label, file$G, 13, 1, 336);
    			attr_dev(input, "id", "search-field");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search...");
    			attr_dev(input, "class", "svelte-1v45dx1");
    			add_location(input, file$G, 14, 1, 403);
    			attr_dev(form, "role", "search");
    			attr_dev(form, "id", "search-box");
    			attr_dev(form, "class", "svelte-1v45dx1");
    			add_location(form, file$G, 12, 0, 259);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, label);
    			mount_component(icon, label, null);
    			append_dev(form, t0);
    			append_dev(form, input);
    			set_input_value(input, /*$state*/ ctx[0].localSearch);
    			append_dev(form, t1);
    			if (if_block) if_block.m(form, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[2]),
    					listen_dev(form, "submit", prevent_default(/*localSearch*/ ctx[1]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$state*/ 1 && input.value !== /*$state*/ ctx[0].localSearch) {
    				set_input_value(input, /*$state*/ ctx[0].localSearch);
    			}

    			if (/*$state*/ ctx[0].localSearch) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$state*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$i(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(form, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(icon);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$M.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$M($$self, $$props, $$invalidate) {
    	let $state;
    	validate_store(state, 'state');
    	component_subscribe($$self, state, $$value => $$invalidate(0, $state = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search_fields', slots, []);

    	function localSearch() {
    		if ($state.localSearch) {
    			search({ "searchTerm": $state.localSearch });
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search_fields> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		$state.localSearch = this.value;
    		state.set($state);
    	}

    	const click_handler = () => set_store_value(state, $state.localSearch = "", $state);
    	$$self.$capture_state = () => ({ Icon: Icons, state, search, localSearch, $state });
    	return [$state, localSearch, input_input_handler, click_handler];
    }

    class Search_fields extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$M, create_fragment$M, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search_fields",
    			options,
    			id: create_fragment$M.name
    		});
    	}
    }

    /* src/components/shared/readLater.svelte generated by Svelte v3.48.0 */
    const file$F = "src/components/shared/readLater.svelte";

    // (26:1) {:else}
    function create_else_block$9(ctx) {
    	let icon;
    	let current;

    	icon = new Icons({
    			props: { name: /*iconName*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*iconName*/ 1) icon_changes.name = /*iconName*/ ctx[0];
    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(26:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (24:1) {#if readLater }
    function create_if_block$h(ctx) {
    	let icon;
    	let current;

    	icon = new Icons({
    			props: {
    				name: "" + (/*iconName*/ ctx[0] + "-filled")
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*iconName*/ 1) icon_changes.name = "" + (/*iconName*/ ctx[0] + "-filled");
    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(24:1) {#if readLater }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$L(ctx) {
    	let button;
    	let current_block_type_index;
    	let if_block;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$h, create_else_block$9];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*readLater*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if_block.c();
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*readLater*/ ctx[1] ? "filled" : "") + " svelte-mbvazx"));
    			add_location(button, file$F, 22, 0, 844);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			if_blocks[current_block_type_index].m(button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", stop_propagation(/*toggle*/ ctx[2]), false, false, true);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(button, null);
    			}

    			if (!current || dirty & /*readLater*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*readLater*/ ctx[1] ? "filled" : "") + " svelte-mbvazx"))) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$L.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$L($$self, $$props, $$invalidate) {
    	let readLater;
    	let $modalState;
    	let $loginState;
    	let $collectionList;
    	validate_store(modalState, 'modalState');
    	component_subscribe($$self, modalState, $$value => $$invalidate(7, $modalState = $$value));
    	validate_store(loginState, 'loginState');
    	component_subscribe($$self, loginState, $$value => $$invalidate(5, $loginState = $$value));
    	validate_store(collectionList, 'collectionList');
    	component_subscribe($$self, collectionList, $$value => $$invalidate(6, $collectionList = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ReadLater', slots, []);
    	let { collectionName = "Read Later" } = $$props;
    	let { iconName = "read-later" } = $$props;
    	let { ID } = $$props;

    	async function toggle() {
    		if ($loginState.loggedIn) {
    			await modifyCollection(collectionName, readLater ? "subtract" : "extend", ID);
    		} else {
    			set_store_value(
    				modalState,
    				$modalState = {
    					"modalType": "auth",
    					"modalContent": {
    						"type": "login",
    						"title": "Login here",
    						"desc": "Login here or signup with the link down below to save articles for later reading."
    					}
    				},
    				$modalState
    			);
    		}
    	}

    	const writable_props = ['collectionName', 'iconName', 'ID'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ReadLater> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('collectionName' in $$props) $$invalidate(3, collectionName = $$props.collectionName);
    		if ('iconName' in $$props) $$invalidate(0, iconName = $$props.iconName);
    		if ('ID' in $$props) $$invalidate(4, ID = $$props.ID);
    	};

    	$$self.$capture_state = () => ({
    		collectionName,
    		iconName,
    		modifyCollection,
    		collectionList,
    		loginState,
    		modalState,
    		ID,
    		Icon: Icons,
    		toggle,
    		readLater,
    		$modalState,
    		$loginState,
    		$collectionList
    	});

    	$$self.$inject_state = $$props => {
    		if ('collectionName' in $$props) $$invalidate(3, collectionName = $$props.collectionName);
    		if ('iconName' in $$props) $$invalidate(0, iconName = $$props.iconName);
    		if ('ID' in $$props) $$invalidate(4, ID = $$props.ID);
    		if ('readLater' in $$props) $$invalidate(1, readLater = $$props.readLater);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$loginState, $collectionList, collectionName, ID*/ 120) {
    			$$invalidate(1, readLater = $loginState.loggedIn && $collectionList && collectionName in $collectionList && Array.isArray($collectionList[collectionName]) && $collectionList[collectionName].includes(ID));
    		}
    	};

    	return [iconName, readLater, toggle, collectionName, ID, $loginState, $collectionList];
    }

    class ReadLater extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$L, create_fragment$L, safe_not_equal, { collectionName: 3, iconName: 0, ID: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ReadLater",
    			options,
    			id: create_fragment$L.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*ID*/ ctx[4] === undefined && !('ID' in props)) {
    			console.warn("<ReadLater> was created without expected prop 'ID'");
    		}
    	}

    	get collectionName() {
    		throw new Error("<ReadLater>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set collectionName(value) {
    		throw new Error("<ReadLater>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconName() {
    		throw new Error("<ReadLater>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconName(value) {
    		throw new Error("<ReadLater>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ID() {
    		throw new Error("<ReadLater>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ID(value) {
    		throw new Error("<ReadLater>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/shared/markArticle.svelte generated by Svelte v3.48.0 */

    // (11:0) {:else}
    function create_else_block$8(ctx) {
    	let readlaterbutton;
    	let current;

    	readlaterbutton = new ReadLater({
    			props: { ID: /*ID*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(readlaterbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(readlaterbutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const readlaterbutton_changes = {};
    			if (dirty & /*ID*/ 1) readlaterbutton_changes.ID = /*ID*/ ctx[0];
    			readlaterbutton.$set(readlaterbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(readlaterbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(readlaterbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(readlaterbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(11:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:0) {#if $state.selectedMenu.type == "collection"}
    function create_if_block$g(ctx) {
    	let readlaterbutton;
    	let current;

    	readlaterbutton = new ReadLater({
    			props: {
    				ID: /*ID*/ ctx[0],
    				collectionName: /*$state*/ ctx[1].selectedMenu.name,
    				iconName: "favorite"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(readlaterbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(readlaterbutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const readlaterbutton_changes = {};
    			if (dirty & /*ID*/ 1) readlaterbutton_changes.ID = /*ID*/ ctx[0];
    			if (dirty & /*$state*/ 2) readlaterbutton_changes.collectionName = /*$state*/ ctx[1].selectedMenu.name;
    			readlaterbutton.$set(readlaterbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(readlaterbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(readlaterbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(readlaterbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(9:0) {#if $state.selectedMenu.type == \\\"collection\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$K(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$g, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$state*/ ctx[1].selectedMenu.type == "collection") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$K.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$K($$self, $$props, $$invalidate) {
    	let $state;
    	validate_store(state, 'state');
    	component_subscribe($$self, state, $$value => $$invalidate(1, $state = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MarkArticle', slots, []);
    	let { ID } = $$props;
    	const writable_props = ['ID'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MarkArticle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ID' in $$props) $$invalidate(0, ID = $$props.ID);
    	};

    	$$self.$capture_state = () => ({ ID, ReadLaterButton: ReadLater, state, $state });

    	$$self.$inject_state = $$props => {
    		if ('ID' in $$props) $$invalidate(0, ID = $$props.ID);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ID, $state];
    }

    class MarkArticle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$K, create_fragment$K, safe_not_equal, { ID: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MarkArticle",
    			options,
    			id: create_fragment$K.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*ID*/ ctx[0] === undefined && !('ID' in props)) {
    			console.warn("<MarkArticle> was created without expected prop 'ID'");
    		}
    	}

    	get ID() {
    		throw new Error("<MarkArticle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ID(value) {
    		throw new Error("<MarkArticle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/shared/loader.svelte generated by Svelte v3.48.0 */
    const file$E = "src/components/shared/loader.svelte";

    // (19:1) {#if text}
    function create_if_block$f(ctx) {
    	let p;
    	let t0;
    	let t1_value = (".").repeat(/*dotCounter*/ ctx[3]) + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Loading");
    			t1 = text(t1_value);
    			attr_dev(p, "class", "svelte-1e6mb1z");
    			add_location(p, file$E, 19, 2, 513);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dotCounter*/ 8 && t1_value !== (t1_value = (".").repeat(/*dotCounter*/ ctx[3]) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(19:1) {#if text}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$J(ctx) {
    	let div10;
    	let div9;
    	let div0;
    	let div1;
    	let div2;
    	let div3;
    	let div4;
    	let div5;
    	let div6;
    	let div7;
    	let div8;
    	let div9_style_value;
    	let t;
    	let if_block = /*text*/ ctx[2] && create_if_block$f(ctx);

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div9 = element("div");
    			div0 = element("div");
    			div1 = element("div");
    			div2 = element("div");
    			div3 = element("div");
    			div4 = element("div");
    			div5 = element("div");
    			div6 = element("div");
    			div7 = element("div");
    			div8 = element("div");
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "svelte-1e6mb1z");
    			add_location(div0, file$E, 17, 115, 393);
    			attr_dev(div1, "class", "svelte-1e6mb1z");
    			add_location(div1, file$E, 17, 126, 404);
    			attr_dev(div2, "class", "svelte-1e6mb1z");
    			add_location(div2, file$E, 17, 137, 415);
    			attr_dev(div3, "class", "svelte-1e6mb1z");
    			add_location(div3, file$E, 17, 148, 426);
    			attr_dev(div4, "class", "svelte-1e6mb1z");
    			add_location(div4, file$E, 17, 159, 437);
    			attr_dev(div5, "class", "svelte-1e6mb1z");
    			add_location(div5, file$E, 17, 170, 448);
    			attr_dev(div6, "class", "svelte-1e6mb1z");
    			add_location(div6, file$E, 17, 181, 459);
    			attr_dev(div7, "class", "svelte-1e6mb1z");
    			add_location(div7, file$E, 17, 192, 470);
    			attr_dev(div8, "class", "svelte-1e6mb1z");
    			add_location(div8, file$E, 17, 203, 481);

    			attr_dev(div9, "style", div9_style_value = "" + ((/*width*/ ctx[0]
    			? "width: " + /*width*/ ctx[0] + ";"
    			: "") + " " + (/*height*/ ctx[1]
    			? "height:" + /*height*/ ctx[1] + ";"
    			: "")));

    			attr_dev(div9, "class", "loading-grid svelte-1e6mb1z");
    			add_location(div9, file$E, 17, 1, 279);
    			attr_dev(div10, "class", "loading-container svelte-1e6mb1z");
    			add_location(div10, file$E, 16, 0, 246);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div9);
    			append_dev(div9, div0);
    			append_dev(div9, div1);
    			append_dev(div9, div2);
    			append_dev(div9, div3);
    			append_dev(div9, div4);
    			append_dev(div9, div5);
    			append_dev(div9, div6);
    			append_dev(div9, div7);
    			append_dev(div9, div8);
    			append_dev(div10, t);
    			if (if_block) if_block.m(div10, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*width, height*/ 3 && div9_style_value !== (div9_style_value = "" + ((/*width*/ ctx[0]
    			? "width: " + /*width*/ ctx[0] + ";"
    			: "") + " " + (/*height*/ ctx[1]
    			? "height:" + /*height*/ ctx[1] + ";"
    			: "")))) {
    				attr_dev(div9, "style", div9_style_value);
    			}

    			if (/*text*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$f(ctx);
    					if_block.c();
    					if_block.m(div10, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$J.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$J($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loader', slots, []);
    	let { width = null } = $$props;
    	let { height = null } = $$props;
    	let { text = false } = $$props;
    	let dotCounter = 1;

    	onMount(() => {
    		setInterval(
    			() => {
    				$$invalidate(3, dotCounter = dotCounter % 3 + 1);
    			},
    			1000
    		);
    	});

    	const writable_props = ['width', 'height', 'text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loader> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ width, height, text, onMount, dotCounter });

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    		if ('dotCounter' in $$props) $$invalidate(3, dotCounter = $$props.dotCounter);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, text, dotCounter];
    }

    class Loader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$J, create_fragment$J, safe_not_equal, { width: 0, height: 1, text: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loader",
    			options,
    			id: create_fragment$J.name
    		});
    	}

    	get width() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/shared/dropdown.svelte generated by Svelte v3.48.0 */

    const file$D = "src/components/shared/dropdown.svelte";

    function create_fragment$I(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "dropdown svelte-k77vgx");
    			add_location(div, file$D, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$I.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$I($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dropdown', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dropdown> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Dropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$I, create_fragment$I, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropdown",
    			options,
    			id: create_fragment$I.name
    		});
    	}
    }

    /* src/components/shared/addToCollection.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1$3 } = globals;
    const file$C = "src/components/shared/addToCollection.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i][0];
    	child_ctx[10] = list[i][1];
    	return child_ctx;
    }

    // (1:0) <script>  export let ID  let collectionPromise = []   import Icon from "./icons.svelte"  import Loader from "./loader.svelte"  import Dropdown from "./dropdown.svelte"   import { modifyCollection, getUserCollections }
    function create_catch_block$3(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$3.name,
    		type: "catch",
    		source: "(1:0) <script>  export let ID  let collectionPromise = []   import Icon from \\\"./icons.svelte\\\"  import Loader from \\\"./loader.svelte\\\"  import Dropdown from \\\"./dropdown.svelte\\\"   import { modifyCollection, getUserCollections }",
    		ctx
    	});

    	return block;
    }

    // (33:2) {:then currentCollectionList}
    function create_then_block$3(ctx) {
    	let each_1_anchor;
    	let each_value = Object.entries(/*currentCollectionList*/ ctx[8]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Object, collectionPromise, ID, handleCheckbox, appConfig*/ 11) {
    				each_value = Object.entries(/*currentCollectionList*/ ctx[8]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$3.name,
    		type: "then",
    		source: "(33:2) {:then currentCollectionList}",
    		ctx
    	});

    	return block;
    }

    // (35:4) {#if !appConfig.permCollections.includes(collectionName)}
    function create_if_block$e(ctx) {
    	let label;
    	let input;
    	let input_value_value;
    	let input_checked_value;
    	let t0;
    	let span;
    	let t1_value = /*collectionName*/ ctx[9] + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(input, "name", "radio");
    			attr_dev(input, "type", "checkbox");
    			input.value = input_value_value = /*collectionName*/ ctx[9];
    			input.checked = input_checked_value = /*IDs*/ ctx[10].includes(/*ID*/ ctx[0]);
    			attr_dev(input, "class", "svelte-kgztcn");
    			add_location(input, file$C, 36, 6, 1339);
    			attr_dev(span, "class", "svelte-kgztcn");
    			add_location(span, file$C, 37, 6, 1463);
    			attr_dev(label, "class", "radio svelte-kgztcn");
    			add_location(label, file$C, 35, 5, 1286);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			append_dev(label, t0);
    			append_dev(label, span);
    			append_dev(span, t1);
    			append_dev(label, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*handleCheckbox*/ ctx[3], false, false, false),
    					listen_dev(label, "click", stop_propagation(/*click_handler*/ ctx[4]), false, false, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*collectionPromise*/ 2 && input_value_value !== (input_value_value = /*collectionName*/ ctx[9])) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (dirty & /*collectionPromise, ID*/ 3 && input_checked_value !== (input_checked_value = /*IDs*/ ctx[10].includes(/*ID*/ ctx[0]))) {
    				prop_dev(input, "checked", input_checked_value);
    			}

    			if (dirty & /*collectionPromise*/ 2 && t1_value !== (t1_value = /*collectionName*/ ctx[9] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(35:4) {#if !appConfig.permCollections.includes(collectionName)}",
    		ctx
    	});

    	return block;
    }

    // (34:3) {#each Object.entries(currentCollectionList) as [collectionName, IDs]}
    function create_each_block$7(ctx) {
    	let show_if = !appConfig.permCollections.includes(/*collectionName*/ ctx[9]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block$e(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*collectionPromise*/ 2) show_if = !appConfig.permCollections.includes(/*collectionName*/ ctx[9]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$e(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(34:3) {#each Object.entries(currentCollectionList) as [collectionName, IDs]}",
    		ctx
    	});

    	return block;
    }

    // (31:28)     <Loader height="2rem" />   {:then currentCollectionList}
    function create_pending_block$3(ctx) {
    	let loader;
    	let current;

    	loader = new Loader({
    			props: { height: "2rem" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$3.name,
    		type: "pending",
    		source: "(31:28)     <Loader height=\\\"2rem\\\" />   {:then currentCollectionList}",
    		ctx
    	});

    	return block;
    }

    // (30:1) <Dropdown>
    function create_default_slot$8(ctx) {
    	let await_block_anchor;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$3,
    		then: create_then_block$3,
    		catch: create_catch_block$3,
    		value: 8,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*collectionPromise*/ ctx[1], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*collectionPromise*/ 2 && promise !== (promise = /*collectionPromise*/ ctx[1]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(30:1) <Dropdown>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$H(ctx) {
    	let button;
    	let icon;
    	let t;
    	let dropdown;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icons({
    			props: { name: "favorite" },
    			$$inline: true
    		});

    	dropdown = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			t = space();
    			create_component(dropdown.$$.fragment);
    			attr_dev(button, "class", "svelte-kgztcn");
    			add_location(button, file$C, 26, 0, 969);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			append_dev(button, t);
    			mount_component(dropdown, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", stop_propagation(/*showDropdown*/ ctx[2]), false, false, true);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const dropdown_changes = {};

    			if (dirty & /*$$scope, collectionPromise, ID*/ 8195) {
    				dropdown_changes.$$scope = { dirty, ctx };
    			}

    			dropdown.$set(dropdown_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(dropdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(dropdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    			destroy_component(dropdown);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$H.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$H($$self, $$props, $$invalidate) {
    	let $collectionList;
    	let $modalState;
    	let $loginState;
    	validate_store(collectionList, 'collectionList');
    	component_subscribe($$self, collectionList, $$value => $$invalidate(5, $collectionList = $$value));
    	validate_store(modalState, 'modalState');
    	component_subscribe($$self, modalState, $$value => $$invalidate(6, $modalState = $$value));
    	validate_store(loginState, 'loginState');
    	component_subscribe($$self, loginState, $$value => $$invalidate(7, $loginState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AddToCollection', slots, []);
    	let { ID } = $$props;
    	let collectionPromise = [];

    	async function showDropdown() {
    		if (!$loginState.loggedIn) {
    			set_store_value(
    				modalState,
    				$modalState = {
    					"modalType": "auth",
    					"modalContent": {
    						"type": "login",
    						"title": "Login here",
    						"desc": "Login here or signup with the link down below to save articles to custom collections."
    					}
    				},
    				$modalState
    			);
    		} else {
    			$$invalidate(1, collectionPromise = (async () => {
    				await getUserCollections();
    				return $collectionList;
    			})());
    		}
    	}

    	function handleCheckbox(e) {
    		$$invalidate(1, collectionPromise = (async () => {
    			await modifyCollection(e.target.value, e.target.checked ? "extend" : "subtract", ID);
    			return $collectionList;
    		})());
    	}

    	const writable_props = ['ID'];

    	Object_1$3.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AddToCollection> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('ID' in $$props) $$invalidate(0, ID = $$props.ID);
    	};

    	$$self.$capture_state = () => ({
    		ID,
    		collectionPromise,
    		Icon: Icons,
    		Loader,
    		Dropdown,
    		modifyCollection,
    		getUserCollections,
    		collectionList,
    		loginState,
    		modalState,
    		appConfig,
    		showDropdown,
    		handleCheckbox,
    		$collectionList,
    		$modalState,
    		$loginState
    	});

    	$$self.$inject_state = $$props => {
    		if ('ID' in $$props) $$invalidate(0, ID = $$props.ID);
    		if ('collectionPromise' in $$props) $$invalidate(1, collectionPromise = $$props.collectionPromise);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ID, collectionPromise, showDropdown, handleCheckbox, click_handler];
    }

    class AddToCollection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$H, create_fragment$H, safe_not_equal, { ID: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddToCollection",
    			options,
    			id: create_fragment$H.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*ID*/ ctx[0] === undefined && !('ID' in props)) {
    			console.warn("<AddToCollection> was created without expected prop 'ID'");
    		}
    	}

    	get ID() {
    		throw new Error("<AddToCollection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ID(value) {
    		throw new Error("<AddToCollection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/article_lists/layouts/large_article_list.svelte generated by Svelte v3.48.0 */
    const file$B = "src/components/article_lists/layouts/large_article_list.svelte";

    function create_fragment$G(ctx) {
    	let article_1;
    	let div1;
    	let div0;
    	let markarticlebutton;
    	let t0;
    	let addtocollectionbutton;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let div3;
    	let div2;
    	let p0;
    	let t3_value = /*article*/ ctx[0].source + "";
    	let t3;
    	let t4;
    	let time_1;
    	let t5;
    	let t6;
    	let h3;
    	let t7_value = /*article*/ ctx[0].title + "";
    	let t7;
    	let t8;
    	let p1;
    	let t9_value = /*article*/ ctx[0].description + "";
    	let t9;
    	let current;
    	let mounted;
    	let dispose;

    	markarticlebutton = new MarkArticle({
    			props: { ID: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	addtocollectionbutton = new AddToCollection({
    			props: { ID: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(markarticlebutton.$$.fragment);
    			t0 = space();
    			create_component(addtocollectionbutton.$$.fragment);
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			div3 = element("div");
    			div2 = element("div");
    			p0 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			time_1 = element("time");
    			t5 = text(/*time*/ ctx[1]);
    			t6 = space();
    			h3 = element("h3");
    			t7 = text(t7_value);
    			t8 = space();
    			p1 = element("p");
    			t9 = text(t9_value);
    			attr_dev(div0, "class", "button-container svelte-1fv2bkf");
    			add_location(div0, file$B, 14, 2, 457);
    			attr_dev(img, "alt", "Article overview");
    			if (!src_url_equal(img.src, img_src_value = /*article*/ ctx[0].image_url)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1fv2bkf");
    			add_location(img, file$B, 18, 2, 583);
    			attr_dev(div1, "class", "image-container svelte-1fv2bkf");
    			add_location(div1, file$B, 13, 1, 400);
    			attr_dev(p0, "class", "source svelte-1fv2bkf");
    			add_location(p0, file$B, 22, 3, 714);
    			attr_dev(time_1, "class", "svelte-1fv2bkf");
    			add_location(time_1, file$B, 23, 3, 758);
    			attr_dev(div2, "class", "article-details svelte-1fv2bkf");
    			add_location(div2, file$B, 21, 2, 681);
    			attr_dev(h3, "class", "svelte-1fv2bkf");
    			add_location(h3, file$B, 25, 2, 791);
    			attr_dev(p1, "class", "description svelte-1fv2bkf");
    			add_location(p1, file$B, 26, 2, 820);
    			attr_dev(div3, "class", "article-content svelte-1fv2bkf");
    			add_location(div3, file$B, 20, 1, 649);
    			attr_dev(article_1, "class", "svelte-1fv2bkf");
    			toggle_class(article_1, "read", /*read*/ ctx[2]);
    			add_location(article_1, file$B, 12, 0, 314);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			append_dev(article_1, div1);
    			append_dev(div1, div0);
    			mount_component(markarticlebutton, div0, null);
    			append_dev(div0, t0);
    			mount_component(addtocollectionbutton, div0, null);
    			append_dev(div1, t1);
    			append_dev(div1, img);
    			append_dev(article_1, t2);
    			append_dev(article_1, div3);
    			append_dev(div3, div2);
    			append_dev(div2, p0);
    			append_dev(p0, t3);
    			append_dev(div2, t4);
    			append_dev(div2, time_1);
    			append_dev(time_1, t5);
    			append_dev(div3, t6);
    			append_dev(div3, h3);
    			append_dev(h3, t7);
    			append_dev(div3, t8);
    			append_dev(div3, p1);
    			append_dev(p1, t9);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", stop_propagation(/*click_handler*/ ctx[4]), false, false, true),
    					listen_dev(article_1, "click", /*click_handler_1*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const markarticlebutton_changes = {};
    			if (dirty & /*article*/ 1) markarticlebutton_changes.ID = /*article*/ ctx[0].id;
    			markarticlebutton.$set(markarticlebutton_changes);
    			const addtocollectionbutton_changes = {};
    			if (dirty & /*article*/ 1) addtocollectionbutton_changes.ID = /*article*/ ctx[0].id;
    			addtocollectionbutton.$set(addtocollectionbutton_changes);

    			if (!current || dirty & /*article*/ 1 && !src_url_equal(img.src, img_src_value = /*article*/ ctx[0].image_url)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty & /*article*/ 1) && t3_value !== (t3_value = /*article*/ ctx[0].source + "")) set_data_dev(t3, t3_value);
    			if (!current || dirty & /*time*/ 2) set_data_dev(t5, /*time*/ ctx[1]);
    			if ((!current || dirty & /*article*/ 1) && t7_value !== (t7_value = /*article*/ ctx[0].title + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty & /*article*/ 1) && t9_value !== (t9_value = /*article*/ ctx[0].description + "")) set_data_dev(t9, t9_value);

    			if (dirty & /*read*/ 4) {
    				toggle_class(article_1, "read", /*read*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(markarticlebutton.$$.fragment, local);
    			transition_in(addtocollectionbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(markarticlebutton.$$.fragment, local);
    			transition_out(addtocollectionbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(markarticlebutton);
    			destroy_component(addtocollectionbutton);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$G.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$G($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Large_article_list', slots, []);
    	let { article } = $$props;
    	let { time } = $$props;
    	let { read = false } = $$props;
    	const dispatch = createEventDispatcher();
    	const writable_props = ['article', 'time', 'read'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Large_article_list> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler_1 = () => dispatch("modal", { "articleID": article.id });

    	$$self.$$set = $$props => {
    		if ('article' in $$props) $$invalidate(0, article = $$props.article);
    		if ('time' in $$props) $$invalidate(1, time = $$props.time);
    		if ('read' in $$props) $$invalidate(2, read = $$props.read);
    	};

    	$$self.$capture_state = () => ({
    		article,
    		time,
    		read,
    		MarkArticleButton: MarkArticle,
    		AddToCollectionButton: AddToCollection,
    		createEventDispatcher,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('article' in $$props) $$invalidate(0, article = $$props.article);
    		if ('time' in $$props) $$invalidate(1, time = $$props.time);
    		if ('read' in $$props) $$invalidate(2, read = $$props.read);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [article, time, read, dispatch, click_handler, click_handler_1];
    }

    class Large_article_list extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$G, create_fragment$G, safe_not_equal, { article: 0, time: 1, read: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Large_article_list",
    			options,
    			id: create_fragment$G.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*article*/ ctx[0] === undefined && !('article' in props)) {
    			console.warn("<Large_article_list> was created without expected prop 'article'");
    		}

    		if (/*time*/ ctx[1] === undefined && !('time' in props)) {
    			console.warn("<Large_article_list> was created without expected prop 'time'");
    		}
    	}

    	get article() {
    		throw new Error("<Large_article_list>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set article(value) {
    		throw new Error("<Large_article_list>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get time() {
    		throw new Error("<Large_article_list>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set time(value) {
    		throw new Error("<Large_article_list>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get read() {
    		throw new Error("<Large_article_list>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set read(value) {
    		throw new Error("<Large_article_list>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/article_lists/layouts/title_article_list.svelte generated by Svelte v3.48.0 */
    const file$A = "src/components/article_lists/layouts/title_article_list.svelte";

    function create_fragment$F(ctx) {
    	let article_1;
    	let markarticlebutton;
    	let t0;
    	let p0;
    	let t1_value = /*article*/ ctx[0].source + "";
    	let t1;
    	let t2;
    	let div;
    	let h3;
    	let t3_value = /*article*/ ctx[0].title + "";
    	let t3;
    	let t4;
    	let p1;
    	let t5_value = /*article*/ ctx[0].description + "";
    	let t5;
    	let t6;
    	let time_1;
    	let t7;
    	let current;
    	let mounted;
    	let dispose;

    	markarticlebutton = new MarkArticle({
    			props: { ID: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(markarticlebutton.$$.fragment);
    			t0 = space();
    			p0 = element("p");
    			t1 = text(t1_value);
    			t2 = space();
    			div = element("div");
    			h3 = element("h3");
    			t3 = text(t3_value);
    			t4 = space();
    			p1 = element("p");
    			t5 = text(t5_value);
    			t6 = space();
    			time_1 = element("time");
    			t7 = text(/*time*/ ctx[1]);
    			attr_dev(p0, "class", "source svelte-23ym7q");
    			add_location(p0, file$A, 14, 1, 366);
    			attr_dev(h3, "class", "svelte-23ym7q");
    			add_location(h3, file$A, 16, 2, 440);
    			attr_dev(p1, "class", "description svelte-23ym7q");
    			add_location(p1, file$A, 17, 2, 469);
    			attr_dev(div, "class", "article-content svelte-23ym7q");
    			add_location(div, file$A, 15, 1, 408);
    			attr_dev(time_1, "class", "svelte-23ym7q");
    			add_location(time_1, file$A, 19, 1, 529);
    			attr_dev(article_1, "class", "svelte-23ym7q");
    			toggle_class(article_1, "read", /*read*/ ctx[2]);
    			add_location(article_1, file$A, 12, 0, 242);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(markarticlebutton, article_1, null);
    			append_dev(article_1, t0);
    			append_dev(article_1, p0);
    			append_dev(p0, t1);
    			append_dev(article_1, t2);
    			append_dev(article_1, div);
    			append_dev(div, h3);
    			append_dev(h3, t3);
    			append_dev(div, t4);
    			append_dev(div, p1);
    			append_dev(p1, t5);
    			append_dev(article_1, t6);
    			append_dev(article_1, time_1);
    			append_dev(time_1, t7);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(article_1, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const markarticlebutton_changes = {};
    			if (dirty & /*article*/ 1) markarticlebutton_changes.ID = /*article*/ ctx[0].id;
    			markarticlebutton.$set(markarticlebutton_changes);
    			if ((!current || dirty & /*article*/ 1) && t1_value !== (t1_value = /*article*/ ctx[0].source + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*article*/ 1) && t3_value !== (t3_value = /*article*/ ctx[0].title + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*article*/ 1) && t5_value !== (t5_value = /*article*/ ctx[0].description + "")) set_data_dev(t5, t5_value);
    			if (!current || dirty & /*time*/ 2) set_data_dev(t7, /*time*/ ctx[1]);

    			if (dirty & /*read*/ 4) {
    				toggle_class(article_1, "read", /*read*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(markarticlebutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(markarticlebutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(markarticlebutton);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$F.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$F($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Title_article_list', slots, []);
    	let { article } = $$props;
    	let { time } = $$props;
    	let { read = false } = $$props;
    	const dispatch = createEventDispatcher();
    	const writable_props = ['article', 'time', 'read'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Title_article_list> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch("modal", { "articleID": article.id });

    	$$self.$$set = $$props => {
    		if ('article' in $$props) $$invalidate(0, article = $$props.article);
    		if ('time' in $$props) $$invalidate(1, time = $$props.time);
    		if ('read' in $$props) $$invalidate(2, read = $$props.read);
    	};

    	$$self.$capture_state = () => ({
    		MarkArticleButton: MarkArticle,
    		article,
    		time,
    		read,
    		createEventDispatcher,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('article' in $$props) $$invalidate(0, article = $$props.article);
    		if ('time' in $$props) $$invalidate(1, time = $$props.time);
    		if ('read' in $$props) $$invalidate(2, read = $$props.read);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [article, time, read, dispatch, click_handler];
    }

    class Title_article_list extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$F, create_fragment$F, safe_not_equal, { article: 0, time: 1, read: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title_article_list",
    			options,
    			id: create_fragment$F.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*article*/ ctx[0] === undefined && !('article' in props)) {
    			console.warn("<Title_article_list> was created without expected prop 'article'");
    		}

    		if (/*time*/ ctx[1] === undefined && !('time' in props)) {
    			console.warn("<Title_article_list> was created without expected prop 'time'");
    		}
    	}

    	get article() {
    		throw new Error("<Title_article_list>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set article(value) {
    		throw new Error("<Title_article_list>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get time() {
    		throw new Error("<Title_article_list>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set time(value) {
    		throw new Error("<Title_article_list>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get read() {
    		throw new Error("<Title_article_list>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set read(value) {
    		throw new Error("<Title_article_list>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const epochs = [
        ['year', 31536000],
        ['month', 2592000],
        ['day', 86400],
        ['hour', 3600],
        ['minute', 60],
        ['second', 1]
    ];

    function getTimespan(origDate) {
    	let timeSpan = (Date.now() - Date.parse(origDate)) / 1000;
    	for (let [name, seconds] of epochs) {
    		if (timeSpan > seconds) {
    			let timeAmount = Math.floor(timeSpan / seconds);
    			return `${timeAmount} ${name}${timeAmount > 1 ? "s" : ""} ago`
    		}
    	}
    }

    /* src/components/article_lists/articleObject.svelte generated by Svelte v3.48.0 */

    function create_fragment$E(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*feedRepresentations*/ ctx[3][/*$state*/ ctx[2].representation];

    	function switch_props(ctx) {
    		return {
    			props: {
    				article: /*article*/ ctx[0],
    				time: getTimespan(/*article*/ ctx[0].publish_date),
    				read: /*read*/ ctx[1]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		switch_instance.$on("modal", /*modal_handler*/ ctx[5]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*article*/ 1) switch_instance_changes.article = /*article*/ ctx[0];
    			if (dirty & /*article*/ 1) switch_instance_changes.time = getTimespan(/*article*/ ctx[0].publish_date);
    			if (dirty & /*read*/ 2) switch_instance_changes.read = /*read*/ ctx[1];

    			if (switch_value !== (switch_value = /*feedRepresentations*/ ctx[3][/*$state*/ ctx[2].representation])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					switch_instance.$on("modal", /*modal_handler*/ ctx[5]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$E.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$E($$self, $$props, $$invalidate) {
    	let read;
    	let $collectionList;
    	let $state;
    	validate_store(collectionList, 'collectionList');
    	component_subscribe($$self, collectionList, $$value => $$invalidate(4, $collectionList = $$value));
    	validate_store(state, 'state');
    	component_subscribe($$self, state, $$value => $$invalidate(2, $state = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ArticleObject', slots, []);
    	let { article } = $$props;

    	const feedRepresentations = {
    		"Large": Large_article_list,
    		"Title-view": Title_article_list
    	};

    	const writable_props = ['article'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ArticleObject> was created with unknown prop '${key}'`);
    	});

    	function modal_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('article' in $$props) $$invalidate(0, article = $$props.article);
    	};

    	$$self.$capture_state = () => ({
    		article,
    		LargeArticles: Large_article_list,
    		TitleArticles: Title_article_list,
    		feedRepresentations,
    		state,
    		loginState,
    		collectionList,
    		getTimespan,
    		read,
    		$collectionList,
    		$state
    	});

    	$$self.$inject_state = $$props => {
    		if ('article' in $$props) $$invalidate(0, article = $$props.article);
    		if ('read' in $$props) $$invalidate(1, read = $$props.read);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$collectionList, article*/ 17) {
    			$$invalidate(1, read = Boolean($collectionList) && "Already Read" in $collectionList && $collectionList["Already Read"].includes(article.id));
    		}
    	};

    	return [article, read, $state, feedRepresentations, $collectionList, modal_handler];
    }

    class ArticleObject extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$E, create_fragment$E, safe_not_equal, { article: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArticleObject",
    			options,
    			id: create_fragment$E.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*article*/ ctx[0] === undefined && !('article' in props)) {
    			console.warn("<ArticleObject> was created without expected prop 'article'");
    		}
    	}

    	get article() {
    		throw new Error("<ArticleObject>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set article(value) {
    		throw new Error("<ArticleObject>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/article_lists/list.svelte generated by Svelte v3.48.0 */
    const file$z = "src/components/article_lists/list.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (28:0) {:else}
    function create_else_block_1$1(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Whoops... an unknown error occurred??";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Please try again later and should the error persists, then please contact your system administrator to handle the error.";
    			attr_dev(h1, "class", "svelte-9bwqm5");
    			add_location(h1, file$z, 29, 1, 916);
    			attr_dev(p, "class", "svelte-9bwqm5");
    			add_location(p, file$z, 30, 1, 964);
    			attr_dev(div, "class", "msg svelte-9bwqm5");
    			add_location(div, file$z, 28, 0, 897);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(28:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (18:0) {#if Array.isArray(articleList)}
    function create_if_block$d(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*articleList*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*article*/ ctx[3].id;
    	validate_each_keys(ctx, each_value, get_each_context$6, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$6(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$6(key, child_ctx));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$7(ctx);
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();

    			if (each_1_else) {
    				each_1_else.c();
    			}
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);

    			if (each_1_else) {
    				each_1_else.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*articleList, createArticleModal*/ 3) {
    				each_value = /*articleList*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$6, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$6, each_1_anchor, get_each_context$6);
    				check_outros();

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block$7(ctx);
    					each_1_else.c();
    					each_1_else.m(each_1_anchor.parentNode, each_1_anchor);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    			if (each_1_else) each_1_else.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(18:0) {#if Array.isArray(articleList)}",
    		ctx
    	});

    	return block;
    }

    // (22:1) {:else}
    function create_else_block$7(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let p;
    	let t3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Hmmm... Seems empty around here?";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Maybe try another search, feed or collection to see if there's some articles there?";
    			t3 = space();
    			attr_dev(h1, "class", "svelte-9bwqm5");
    			add_location(h1, file$z, 23, 3, 735);
    			attr_dev(p, "class", "svelte-9bwqm5");
    			add_location(p, file$z, 24, 3, 780);
    			attr_dev(div, "class", "msg svelte-9bwqm5");
    			add_location(div, file$z, 22, 2, 714);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(div, t3);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(22:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (19:1) {#each articleList as article (article.id)}
    function create_each_block$6(key_1, ctx) {
    	let first;
    	let articleobject;
    	let t;
    	let hr;
    	let current;

    	articleobject = new ArticleObject({
    			props: { article: /*article*/ ctx[3] },
    			$$inline: true
    		});

    	articleobject.$on("modal", /*createArticleModal*/ ctx[1]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(articleobject.$$.fragment);
    			t = space();
    			hr = element("hr");
    			add_location(hr, file$z, 20, 2, 698);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(articleobject, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, hr, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const articleobject_changes = {};
    			if (dirty & /*articleList*/ 1) articleobject_changes.article = /*article*/ ctx[3];
    			articleobject.$set(articleobject_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(articleobject.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(articleobject.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(articleobject, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(19:1) {#each articleList as article (article.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$D(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$d, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*articleList*/ 1) show_if = null;
    		if (show_if == null) show_if = !!Array.isArray(/*articleList*/ ctx[0]);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, -1);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$D($$self, $$props, $$invalidate) {
    	let $modalState;
    	validate_store(modalState, 'modalState');
    	component_subscribe($$self, modalState, $$value => $$invalidate(2, $modalState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('List', slots, []);
    	let { articleList } = $$props;

    	async function createArticleModal(event) {
    		let articleContent = (await getArticleContent(event.detail.articleID))[0];

    		set_store_value(
    			modalState,
    			$modalState = {
    				"modalType": "article",
    				"modalContent": articleContent
    			},
    			$modalState
    		);

    		modifyCollection("Already Read", "extend", event.detail.articleID);
    	}

    	const writable_props = ['articleList'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('articleList' in $$props) $$invalidate(0, articleList = $$props.articleList);
    	};

    	$$self.$capture_state = () => ({
    		articleList,
    		modalState,
    		getArticleContent,
    		modifyCollection,
    		ArticleObject,
    		createArticleModal,
    		$modalState
    	});

    	$$self.$inject_state = $$props => {
    		if ('articleList' in $$props) $$invalidate(0, articleList = $$props.articleList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [articleList, createArticleModal];
    }

    class List$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$D, create_fragment$D, safe_not_equal, { articleList: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$D.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*articleList*/ ctx[0] === undefined && !('articleList' in props)) {
    			console.warn("<List> was created without expected prop 'articleList'");
    		}
    	}

    	get articleList() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set articleList(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/article_lists/configs/rendering.svelte generated by Svelte v3.48.0 */
    const file$y = "src/components/article_lists/configs/rendering.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (7:1) {#each ["Title-view", "Large"] as renderingOption}
    function create_each_block$5(ctx) {
    	let label;
    	let input;
    	let t0;
    	let span;
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = text(/*renderingOption*/ ctx[3]);
    			t2 = space();
    			attr_dev(input, "name", "radio");
    			attr_dev(input, "type", "radio");
    			input.__value = /*renderingOption*/ ctx[3];
    			input.value = input.__value;
    			attr_dev(input, "class", "svelte-1ywl1lk");
    			/*$$binding_groups*/ ctx[2][0].push(input);
    			add_location(input, file$y, 8, 3, 214);
    			attr_dev(span, "class", "svelte-1ywl1lk");
    			add_location(span, file$y, 9, 3, 310);
    			attr_dev(label, "class", "radio svelte-1ywl1lk");
    			add_location(label, file$y, 7, 2, 189);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = input.__value === /*$state*/ ctx[0].representation;
    			append_dev(label, t0);
    			append_dev(label, span);
    			append_dev(span, t1);
    			append_dev(label, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$state*/ 1) {
    				input.checked = input.__value === /*$state*/ ctx[0].representation;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[2][0].splice(/*$$binding_groups*/ ctx[2][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(7:1) {#each [\\\"Title-view\\\", \\\"Large\\\"] as renderingOption}",
    		ctx
    	});

    	return block;
    }

    // (6:0) <Dropdown>
    function create_default_slot$7(ctx) {
    	let each_1_anchor;
    	let each_value = ["Title-view", "Large"];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 2; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < 2; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < 2; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$state*/ 1) {
    				each_value = ["Title-view", "Large"];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 2; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < 2; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(6:0) <Dropdown>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$C(ctx) {
    	let dropdown;
    	let current;

    	dropdown = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdown.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdown, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const dropdown_changes = {};

    			if (dirty & /*$$scope, $state*/ 65) {
    				dropdown_changes.$$scope = { dirty, ctx };
    			}

    			dropdown.$set(dropdown_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdown, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$C($$self, $$props, $$invalidate) {
    	let $state;
    	validate_store(state, 'state');
    	component_subscribe($$self, state, $$value => $$invalidate(0, $state = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Rendering', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Rendering> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_change_handler() {
    		$state.representation = this.__value;
    		state.set($state);
    	}

    	$$self.$capture_state = () => ({ Dropdown, state, $state });
    	return [$state, input_change_handler, $$binding_groups];
    }

    class Rendering extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$C, create_fragment$C, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Rendering",
    			options,
    			id: create_fragment$C.name
    		});
    	}
    }

    /* src/components/article_lists/main.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1$2 } = globals;
    const file$x = "src/components/article_lists/main.svelte";

    // (1:0) <script>  import ArticleList from "../article_lists/list.svelte"  import Icon from "../shared/icons.svelte"  import RenderConfig from "../article_lists/configs/rendering.svelte"  import Loader from "../shared/loader.svelte"   import { fade }
    function create_catch_block_2(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block_2.name,
    		type: "catch",
    		source: "(1:0) <script>  import ArticleList from \\\"../article_lists/list.svelte\\\"  import Icon from \\\"../shared/icons.svelte\\\"  import RenderConfig from \\\"../article_lists/configs/rendering.svelte\\\"  import Loader from \\\"../shared/loader.svelte\\\"   import { fade }",
    		ctx
    	});

    	return block;
    }

    // (83:2) {:then read}
    function create_then_block_2(ctx) {
    	let h2;
    	let t;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(/*pageTitle*/ ctx[1]);
    			attr_dev(h2, "class", "svelte-15tw48i");
    			toggle_class(h2, "read", /*read*/ ctx[13]);
    			add_location(h2, file$x, 83, 3, 2755);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pageTitle*/ 2) set_data_dev(t, /*pageTitle*/ ctx[1]);

    			if (dirty & /*$allArticlesRead*/ 4) {
    				toggle_class(h2, "read", /*read*/ ctx[13]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block_2.name,
    		type: "then",
    		source: "(83:2) {:then read}",
    		ctx
    	});

    	return block;
    }

    // (81:27)     <h2>{ pageTitle }
    function create_pending_block_2(ctx) {
    	let h2;
    	let t;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(/*pageTitle*/ ctx[1]);
    			attr_dev(h2, "class", "svelte-15tw48i");
    			add_location(h2, file$x, 81, 3, 2714);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pageTitle*/ 2) set_data_dev(t, /*pageTitle*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block_2.name,
    		type: "pending",
    		source: "(81:27)     <h2>{ pageTitle }",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>  import ArticleList from "../article_lists/list.svelte"  import Icon from "../shared/icons.svelte"  import RenderConfig from "../article_lists/configs/rendering.svelte"  import Loader from "../shared/loader.svelte"   import { fade }
    function create_catch_block_1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block_1.name,
    		type: "catch",
    		source: "(1:0) <script>  import ArticleList from \\\"../article_lists/list.svelte\\\"  import Icon from \\\"../shared/icons.svelte\\\"  import RenderConfig from \\\"../article_lists/configs/rendering.svelte\\\"  import Loader from \\\"../shared/loader.svelte\\\"   import { fade }",
    		ctx
    	});

    	return block;
    }

    // (88:43)      <a href="{ link }
    function create_then_block_1(ctx) {
    	let a;
    	let icon;
    	let a_href_value;
    	let current;

    	icon = new Icons({
    			props: { name: "download" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			a = element("a");
    			create_component(icon.$$.fragment);
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[12]);
    			attr_dev(a, "class", "svelte-15tw48i");
    			add_location(a, file$x, 88, 4, 2875);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			mount_component(icon, a, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*$downloadArticlesLink*/ 8 && a_href_value !== (a_href_value = /*link*/ ctx[12])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block_1.name,
    		type: "then",
    		source: "(88:43)      <a href=\\\"{ link }",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>  import ArticleList from "../article_lists/list.svelte"  import Icon from "../shared/icons.svelte"  import RenderConfig from "../article_lists/configs/rendering.svelte"  import Loader from "../shared/loader.svelte"   import { fade }
    function create_pending_block_1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block_1.name,
    		type: "pending",
    		source: "(1:0) <script>  import ArticleList from \\\"../article_lists/list.svelte\\\"  import Icon from \\\"../shared/icons.svelte\\\"  import RenderConfig from \\\"../article_lists/configs/rendering.svelte\\\"  import Loader from \\\"../shared/loader.svelte\\\"   import { fade }",
    		ctx
    	});

    	return block;
    }

    // (91:3) {#if $state.selectedMenu.type === "collection"}
    function create_if_block$c(ctx) {
    	let button;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icons({
    			props: { name: "trashcan" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			attr_dev(button, "class", "config-options svelte-15tw48i");
    			add_location(button, file$x, 91, 4, 2989);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(91:3) {#if $state.selectedMenu.type === \\\"collection\\\"}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>  import ArticleList from "../article_lists/list.svelte"  import Icon from "../shared/icons.svelte"  import RenderConfig from "../article_lists/configs/rendering.svelte"  import Loader from "../shared/loader.svelte"   import { fade }
    function create_catch_block$2(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$2.name,
    		type: "catch",
    		source: "(1:0) <script>  import ArticleList from \\\"../article_lists/list.svelte\\\"  import Icon from \\\"../shared/icons.svelte\\\"  import RenderConfig from \\\"../article_lists/configs/rendering.svelte\\\"  import Loader from \\\"../shared/loader.svelte\\\"   import { fade }",
    		ctx
    	});

    	return block;
    }

    // (106:2) {:then articleList}
    function create_then_block$2(ctx) {
    	let articlelist;
    	let current;

    	articlelist = new List$1({
    			props: { articleList: /*articleList*/ ctx[11] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(articlelist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(articlelist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const articlelist_changes = {};
    			if (dirty & /*$currentArticle*/ 16) articlelist_changes.articleList = /*articleList*/ ctx[11];
    			articlelist.$set(articlelist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(articlelist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(articlelist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(articlelist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$2.name,
    		type: "then",
    		source: "(106:2) {:then articleList}",
    		ctx
    	});

    	return block;
    }

    // (104:26)     <Loader height="20%" text={true}
    function create_pending_block$2(ctx) {
    	let loader;
    	let current;

    	loader = new Loader({
    			props: { height: "20%", text: true },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$2.name,
    		type: "pending",
    		source: "(104:26)     <Loader height=\\\"20%\\\" text={true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$B(ctx) {
    	let section1;
    	let header;
    	let promise;
    	let t0;
    	let section0;
    	let promise_1;
    	let t1;
    	let t2;
    	let button;
    	let icon;
    	let t3;
    	let renderconfig;
    	let t4;
    	let hr;
    	let t5;
    	let promise_2;
    	let section1_transition;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block_2,
    		then: create_then_block_2,
    		catch: create_catch_block_2,
    		value: 13
    	};

    	handle_promise(promise = /*$allArticlesRead*/ ctx[2], info);

    	let info_1 = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block_1,
    		then: create_then_block_1,
    		catch: create_catch_block_1,
    		value: 12,
    		blocks: [,,,]
    	};

    	handle_promise(promise_1 = /*$downloadArticlesLink*/ ctx[3], info_1);
    	let if_block = /*$state*/ ctx[0].selectedMenu.type === "collection" && create_if_block$c(ctx);

    	icon = new Icons({
    			props: { name: "three-dots" },
    			$$inline: true
    		});

    	renderconfig = new Rendering({ $$inline: true });

    	let info_2 = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$2,
    		then: create_then_block$2,
    		catch: create_catch_block$2,
    		value: 11,
    		blocks: [,,,]
    	};

    	handle_promise(promise_2 = /*$currentArticle*/ ctx[4], info_2);

    	const block = {
    		c: function create() {
    			section1 = element("section");
    			header = element("header");
    			info.block.c();
    			t0 = space();
    			section0 = element("section");
    			info_1.block.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			button = element("button");
    			create_component(icon.$$.fragment);
    			t3 = space();
    			create_component(renderconfig.$$.fragment);
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			info_2.block.c();
    			attr_dev(button, "class", "config-options svelte-15tw48i");
    			add_location(button, file$x, 95, 3, 3366);
    			attr_dev(section0, "class", "icons svelte-15tw48i");
    			add_location(section0, file$x, 86, 2, 2803);
    			attr_dev(header, "class", "svelte-15tw48i");
    			add_location(header, file$x, 79, 1, 2674);
    			attr_dev(hr, "class", "svelte-15tw48i");
    			add_location(hr, file$x, 101, 1, 3487);
    			attr_dev(section1, "id", "article-list");
    			attr_dev(section1, "class", "svelte-15tw48i");
    			add_location(section1, file$x, 78, 0, 2629);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section1, anchor);
    			append_dev(section1, header);
    			info.block.m(header, info.anchor = null);
    			info.mount = () => header;
    			info.anchor = t0;
    			append_dev(header, t0);
    			append_dev(header, section0);
    			info_1.block.m(section0, info_1.anchor = null);
    			info_1.mount = () => section0;
    			info_1.anchor = t1;
    			append_dev(section0, t1);
    			if (if_block) if_block.m(section0, null);
    			append_dev(section0, t2);
    			append_dev(section0, button);
    			mount_component(icon, button, null);
    			append_dev(button, t3);
    			mount_component(renderconfig, button, null);
    			append_dev(section1, t4);
    			append_dev(section1, hr);
    			append_dev(section1, t5);
    			info_2.block.m(section1, info_2.anchor = null);
    			info_2.mount = () => section1;
    			info_2.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*$allArticlesRead*/ 4 && promise !== (promise = /*$allArticlesRead*/ ctx[2]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}

    			info_1.ctx = ctx;

    			if (dirty & /*$downloadArticlesLink*/ 8 && promise_1 !== (promise_1 = /*$downloadArticlesLink*/ ctx[3]) && handle_promise(promise_1, info_1)) ; else {
    				update_await_block_branch(info_1, ctx, dirty);
    			}

    			if (/*$state*/ ctx[0].selectedMenu.type === "collection") {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$state*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$c(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(section0, t2);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			info_2.ctx = ctx;

    			if (dirty & /*$currentArticle*/ 16 && promise_2 !== (promise_2 = /*$currentArticle*/ ctx[4]) && handle_promise(promise_2, info_2)) ; else {
    				update_await_block_branch(info_2, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info_1.block);
    			transition_in(if_block);
    			transition_in(icon.$$.fragment, local);
    			transition_in(renderconfig.$$.fragment, local);
    			transition_in(info_2.block);

    			add_render_callback(() => {
    				if (!section1_transition) section1_transition = create_bidirectional_transition(section1, fade, {}, true);
    				section1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info_1.blocks[i];
    				transition_out(block);
    			}

    			transition_out(if_block);
    			transition_out(icon.$$.fragment, local);
    			transition_out(renderconfig.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info_2.blocks[i];
    				transition_out(block);
    			}

    			if (!section1_transition) section1_transition = create_bidirectional_transition(section1, fade, {}, false);
    			section1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section1);
    			info.block.d();
    			info.token = null;
    			info = null;
    			info_1.block.d();
    			info_1.token = null;
    			info_1 = null;
    			if (if_block) if_block.d();
    			destroy_component(icon);
    			destroy_component(renderconfig);
    			info_2.block.d();
    			info_2.token = null;
    			info_2 = null;
    			if (detaching && section1_transition) section1_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	let pageTitle;
    	let $collectionArticles;
    	let $state;
    	let $allArticlesRead;
    	let $downloadArticlesLink;
    	let $currentArticle;
    	validate_store(collectionArticles, 'collectionArticles');
    	component_subscribe($$self, collectionArticles, $$value => $$invalidate(9, $collectionArticles = $$value));
    	validate_store(state, 'state');
    	component_subscribe($$self, state, $$value => $$invalidate(0, $state = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main', slots, []);

    	const refreshArticleUnsubscribe = feeds.subscribe(currentFeeds => {
    		refreshArticles(currentFeeds);
    	});

    	const currentArticle = derived([state, articles], async ([$state, $articles]) => {
    		let articleSource;

    		if ($state.selectedMenu.type == "collection") {
    			await getUserCollections($state.selectedMenu.name);
    			articleSource = $collectionArticles;
    		} else {
    			articleSource = $articles;
    		}

    		if (["feed", "collection", "search"].includes($state.selectedMenu.type)) {
    			let showFeed = Boolean(articleSource) && $state.selectedMenu.name in articleSource;

    			if (showFeed && $state.localSearch) {
    				return articleSource[$state.selectedMenu.name].articles.filter(article => Object.values(article).some(articleField => articleField.toLowerCase().includes($state.localSearch.toLowerCase())));
    			} else if (showFeed) {
    				return articleSource[$state.selectedMenu.name].articles;
    			} else {
    				return [];
    			}
    		}
    	});

    	validate_store(currentArticle, 'currentArticle');
    	component_subscribe($$self, currentArticle, value => $$invalidate(4, $currentArticle = value));

    	const downloadArticlesLink = derived(currentArticle, $currentArticle => {
    		return $currentArticle.then(articleList => {
    			if (Boolean(articleList)) {
    				return `${appConfig.rootUrl}/articles/MD/multiple?${articleList.map(article => "IDs=" + article.id).join("&")}`;
    			} else {
    				return "";
    			}
    		});
    	});

    	validate_store(downloadArticlesLink, 'downloadArticlesLink');
    	component_subscribe($$self, downloadArticlesLink, value => $$invalidate(3, $downloadArticlesLink = value));

    	const allArticlesRead = derived([currentArticle, collectionList], async ([$currentArticle, $collectionList]) => {
    		if (!Boolean($collectionList) || !"Already Read" in $collectionList) {
    			return false;
    		}

    		return $currentArticle.then(articleList => {
    			if (Boolean(articleList)) {
    				for (const article of articleList) {
    					if (!$collectionList["Already Read"].includes(article.id)) {
    						return false;
    					}
    				}

    				return true;
    			} else {
    				return false;
    			}
    		});
    	});

    	validate_store(allArticlesRead, 'allArticlesRead');
    	component_subscribe($$self, allArticlesRead, value => $$invalidate(2, $allArticlesRead = value));
    	onDestroy(refreshArticleUnsubscribe);
    	const writable_props = [];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => changeOnlineState(`/users/collections/clear/${encodeURIComponent($state.selectedMenu.name)}`, "POST", null, `clear ${$state.selectedMenu.name} collection`, collectionData => {
    		updateCollectionStores(collectionData);
    		state.set($state);
    	});

    	$$self.$capture_state = () => ({
    		ArticleList: List$1,
    		Icon: Icons,
    		RenderConfig: Rendering,
    		Loader,
    		fade,
    		derived,
    		feeds,
    		articles,
    		state,
    		collectionArticles,
    		collectionList,
    		appConfig,
    		refreshArticles,
    		getUserCollections,
    		updateCollectionStores,
    		changeOnlineState,
    		onDestroy,
    		refreshArticleUnsubscribe,
    		currentArticle,
    		downloadArticlesLink,
    		allArticlesRead,
    		pageTitle,
    		$collectionArticles,
    		$state,
    		$allArticlesRead,
    		$downloadArticlesLink,
    		$currentArticle
    	});

    	$$self.$inject_state = $$props => {
    		if ('pageTitle' in $$props) $$invalidate(1, pageTitle = $$props.pageTitle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$state*/ 1) {
    			$$invalidate(1, pageTitle = `${$state.selectedMenu.name} - ${$state.selectedMenu.type.charAt(0).toUpperCase() + $state.selectedMenu.type.slice(1)}`);
    		}
    	};

    	return [
    		$state,
    		pageTitle,
    		$allArticlesRead,
    		$downloadArticlesLink,
    		$currentArticle,
    		currentArticle,
    		downloadArticlesLink,
    		allArticlesRead,
    		click_handler
    	];
    }

    class Main$2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$B.name
    		});
    	}
    }

    /* src/components/main_window.svelte generated by Svelte v3.48.0 */
    const file$w = "src/components/main_window.svelte";

    // (10:0) {#if ["feed", "search", "collection"].includes($state.selectedMenu.type)}
    function create_if_block$b(ctx) {
    	let searchfield;
    	let t;
    	let articlelisting;
    	let current;
    	searchfield = new Search_fields({ $$inline: true });
    	articlelisting = new Main$2({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(searchfield.$$.fragment);
    			t = space();
    			create_component(articlelisting.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(searchfield, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(articlelisting, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchfield.$$.fragment, local);
    			transition_in(articlelisting.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchfield.$$.fragment, local);
    			transition_out(articlelisting.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(searchfield, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(articlelisting, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(10:0) {#if [\\\"feed\\\", \\\"search\\\", \\\"collection\\\"].includes($state.selectedMenu.type)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$A(ctx) {
    	let section;
    	let show_if = ["feed", "search", "collection"].includes(/*$state*/ ctx[0].selectedMenu.type);
    	let current;
    	let if_block = show_if && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if (if_block) if_block.c();
    			attr_dev(section, "id", "main-content");
    			attr_dev(section, "class", "svelte-16ls2m9");
    			add_location(section, file$w, 7, 0, 174);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if (if_block) if_block.m(section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$state*/ 1) show_if = ["feed", "search", "collection"].includes(/*$state*/ ctx[0].selectedMenu.type);

    			if (show_if) {
    				if (if_block) {
    					if (dirty & /*$state*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(section, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
    	let $state;
    	validate_store(state, 'state');
    	component_subscribe($$self, state, $$value => $$invalidate(0, $state = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main_window', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main_window> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SearchField: Search_fields,
    		ArticleListing: Main$2,
    		state,
    		$state
    	});

    	return [$state];
    }

    class Main_window extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main_window",
    			options,
    			id: create_fragment$A.name
    		});
    	}
    }

    function supressWarnings() {
      const origWarn = console.warn;

      console.warn = (message) => {
        if (message.includes('unknown prop')) return
        if (message.includes('unexpected slot')) return
        origWarn(message);
      };

      onMount(() => {
        console.warn = origWarn;
      });
    }

    /* node_modules/svelte-markdown/src/Parser.svelte generated by Svelte v3.48.0 */

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (19:2) {#if renderers[type]}
    function create_if_block_1$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$4, create_if_block_3$3, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*type*/ ctx[0] === 'table') return 0;
    		if (/*type*/ ctx[0] === 'list') return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(19:2) {#if renderers[type]}",
    		ctx
    	});

    	return block;
    }

    // (14:0) {#if !type}
    function create_if_block$a(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*tokens*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tokens, renderers*/ 34) {
    				each_value = /*tokens*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(14:0) {#if !type}",
    		ctx
    	});

    	return block;
    }

    // (69:4) {:else}
    function create_else_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*$$restProps*/ ctx[6]];
    	var switch_value = /*renderers*/ ctx[5][/*type*/ ctx[0]];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot_11] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$$restProps*/ 64)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*$$restProps*/ ctx[6])])
    			: {};

    			if (dirty & /*$$scope, tokens, renderers, $$restProps*/ 8388706) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5][/*type*/ ctx[0]])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(69:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (51:30) 
    function create_if_block_3$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_4$1, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*ordered*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(51:30) ",
    		ctx
    	});

    	return block;
    }

    // (20:4) {#if type === 'table'}
    function create_if_block_2$4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*renderers*/ ctx[5].table;

    	function switch_props(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty & /*$$scope, renderers, rows, $$restProps, header*/ 8388716) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].table)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(20:4) {#if type === 'table'}",
    		ctx
    	});

    	return block;
    }

    // (73:8) {:else}
    function create_else_block_2(ctx) {
    	let t_value = /*$$restProps*/ ctx[6].raw + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$$restProps*/ 64 && t_value !== (t_value = /*$$restProps*/ ctx[6].raw + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(73:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (71:8) {#if tokens}
    function create_if_block_5$1(ctx) {
    	let parser;
    	let current;

    	parser = new Parser$1({
    			props: {
    				tokens: /*tokens*/ ctx[1],
    				renderers: /*renderers*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parser_changes = {};
    			if (dirty & /*tokens*/ 2) parser_changes.tokens = /*tokens*/ ctx[1];
    			if (dirty & /*renderers*/ 32) parser_changes.renderers = /*renderers*/ ctx[5];
    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(71:8) {#if tokens}",
    		ctx
    	});

    	return block;
    }

    // (70:6) <svelte:component this={renderers[type]} {...$$restProps}>
    function create_default_slot_11(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_5$1, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_3(ctx, dirty) {
    		if (/*tokens*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_3(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_3(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(70:6) <svelte:component this={renderers[type]} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    // (60:6) {:else}
    function create_else_block$6(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ ordered: /*ordered*/ ctx[4] }, /*$$restProps*/ ctx[6]];
    	var switch_value = /*renderers*/ ctx[5].list;

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot_9] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*ordered, $$restProps*/ 80)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*ordered*/ 16 && { ordered: /*ordered*/ ctx[4] },
    					dirty & /*$$restProps*/ 64 && get_spread_object(/*$$restProps*/ ctx[6])
    				])
    			: {};

    			if (dirty & /*$$scope, $$restProps, renderers*/ 8388704) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].list)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(60:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (52:6) {#if ordered}
    function create_if_block_4$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ ordered: /*ordered*/ ctx[4] }, /*$$restProps*/ ctx[6]];
    	var switch_value = /*renderers*/ ctx[5].list;

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot_7] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*ordered, $$restProps*/ 80)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*ordered*/ 16 && { ordered: /*ordered*/ ctx[4] },
    					dirty & /*$$restProps*/ 64 && get_spread_object(/*$$restProps*/ ctx[6])
    				])
    			: {};

    			if (dirty & /*$$scope, $$restProps, renderers*/ 8388704) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].list)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(52:6) {#if ordered}",
    		ctx
    	});

    	return block;
    }

    // (63:12) <svelte:component this={renderers.unorderedlistitem || renderers.listitem} {...item}>
    function create_default_slot_10(ctx) {
    	let parser;
    	let t;
    	let current;

    	parser = new Parser$1({
    			props: {
    				tokens: /*item*/ ctx[18].tokens,
    				renderers: /*renderers*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parser_changes = {};
    			if (dirty & /*$$restProps*/ 64) parser_changes.tokens = /*item*/ ctx[18].tokens;
    			if (dirty & /*renderers*/ 32) parser_changes.renderers = /*renderers*/ ctx[5];
    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(63:12) <svelte:component this={renderers.unorderedlistitem || renderers.listitem} {...item}>",
    		ctx
    	});

    	return block;
    }

    // (62:10) {#each $$restProps.items as item}
    function create_each_block_5(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*item*/ ctx[18]];
    	var switch_value = /*renderers*/ ctx[5].unorderedlistitem || /*renderers*/ ctx[5].listitem;

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot_10] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$$restProps*/ 64)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*item*/ ctx[18])])
    			: {};

    			if (dirty & /*$$scope, $$restProps, renderers*/ 8388704) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].unorderedlistitem || /*renderers*/ ctx[5].listitem)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(62:10) {#each $$restProps.items as item}",
    		ctx
    	});

    	return block;
    }

    // (61:8) <svelte:component this={renderers.list} {ordered} {...$$restProps}>
    function create_default_slot_9(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_5 = /*$$restProps*/ ctx[6].items;
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*renderers, $$restProps*/ 96) {
    				each_value_5 = /*$$restProps*/ ctx[6].items;
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_5.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_5.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(61:8) <svelte:component this={renderers.list} {ordered} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    // (55:12) <svelte:component this={renderers.orderedlistitem || renderers.listitem} {...item}>
    function create_default_slot_8(ctx) {
    	let parser;
    	let t;
    	let current;

    	parser = new Parser$1({
    			props: {
    				tokens: /*item*/ ctx[18].tokens,
    				renderers: /*renderers*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parser_changes = {};
    			if (dirty & /*$$restProps*/ 64) parser_changes.tokens = /*item*/ ctx[18].tokens;
    			if (dirty & /*renderers*/ 32) parser_changes.renderers = /*renderers*/ ctx[5];
    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(55:12) <svelte:component this={renderers.orderedlistitem || renderers.listitem} {...item}>",
    		ctx
    	});

    	return block;
    }

    // (54:10) {#each $$restProps.items as item}
    function create_each_block_4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*item*/ ctx[18]];
    	var switch_value = /*renderers*/ ctx[5].orderedlistitem || /*renderers*/ ctx[5].listitem;

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot_8] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$$restProps*/ 64)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*item*/ ctx[18])])
    			: {};

    			if (dirty & /*$$scope, $$restProps, renderers*/ 8388704) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].orderedlistitem || /*renderers*/ ctx[5].listitem)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(54:10) {#each $$restProps.items as item}",
    		ctx
    	});

    	return block;
    }

    // (53:8) <svelte:component this={renderers.list} {ordered} {...$$restProps}>
    function create_default_slot_7(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_4 = /*$$restProps*/ ctx[6].items;
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*renderers, $$restProps*/ 96) {
    				each_value_4 = /*$$restProps*/ ctx[6].items;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_4.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_4.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(53:8) <svelte:component this={renderers.list} {ordered} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    // (25:14) <svelte:component                 this={renderers.tablecell}                 header={true}                 align={$$restProps.align[i] || 'center'}                 >
    function create_default_slot_6(ctx) {
    	let parser;
    	let t;
    	let current;

    	parser = new Parser$1({
    			props: {
    				tokens: /*headerItem*/ ctx[16].tokens,
    				renderers: /*renderers*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parser_changes = {};
    			if (dirty & /*header*/ 4) parser_changes.tokens = /*headerItem*/ ctx[16].tokens;
    			if (dirty & /*renderers*/ 32) parser_changes.renderers = /*renderers*/ ctx[5];
    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(25:14) <svelte:component                 this={renderers.tablecell}                 header={true}                 align={$$restProps.align[i] || 'center'}                 >",
    		ctx
    	});

    	return block;
    }

    // (24:12) {#each header as headerItem, i}
    function create_each_block_3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*renderers*/ ctx[5].tablecell;

    	function switch_props(ctx) {
    		return {
    			props: {
    				header: true,
    				align: /*$$restProps*/ ctx[6].align[/*i*/ ctx[15]] || 'center',
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*$$restProps*/ 64) switch_instance_changes.align = /*$$restProps*/ ctx[6].align[/*i*/ ctx[15]] || 'center';

    			if (dirty & /*$$scope, header, renderers*/ 8388644) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].tablecell)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(24:12) {#each header as headerItem, i}",
    		ctx
    	});

    	return block;
    }

    // (23:10) <svelte:component this={renderers.tablerow}>
    function create_default_slot_5(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_3 = /*header*/ ctx[2];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*renderers, $$restProps, header*/ 100) {
    				each_value_3 = /*header*/ ctx[2];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_3.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_3.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(23:10) <svelte:component this={renderers.tablerow}>",
    		ctx
    	});

    	return block;
    }

    // (22:8) <svelte:component this={renderers.tablehead}>
    function create_default_slot_4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*renderers*/ ctx[5].tablerow;

    	function switch_props(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty & /*$$scope, header, renderers, $$restProps*/ 8388708) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].tablerow)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(22:8) <svelte:component this={renderers.tablehead}>",
    		ctx
    	});

    	return block;
    }

    // (39:16) <svelte:component                   this={renderers.tablecell}                   header={false}                   align={$$restProps.align[i] || 'center'}                   >
    function create_default_slot_3$1(ctx) {
    	let parser;
    	let current;

    	parser = new Parser$1({
    			props: {
    				tokens: /*cells*/ ctx[13].tokens,
    				renderers: /*renderers*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parser_changes = {};
    			if (dirty & /*rows*/ 8) parser_changes.tokens = /*cells*/ ctx[13].tokens;
    			if (dirty & /*renderers*/ 32) parser_changes.renderers = /*renderers*/ ctx[5];
    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(39:16) <svelte:component                   this={renderers.tablecell}                   header={false}                   align={$$restProps.align[i] || 'center'}                   >",
    		ctx
    	});

    	return block;
    }

    // (38:14) {#each row as cells, i}
    function create_each_block_2$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*renderers*/ ctx[5].tablecell;

    	function switch_props(ctx) {
    		return {
    			props: {
    				header: false,
    				align: /*$$restProps*/ ctx[6].align[/*i*/ ctx[15]] || 'center',
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*$$restProps*/ 64) switch_instance_changes.align = /*$$restProps*/ ctx[6].align[/*i*/ ctx[15]] || 'center';

    			if (dirty & /*$$scope, rows, renderers*/ 8388648) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].tablecell)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(38:14) {#each row as cells, i}",
    		ctx
    	});

    	return block;
    }

    // (37:12) <svelte:component this={renderers.tablerow}>
    function create_default_slot_2$2(ctx) {
    	let t;
    	let current;
    	let each_value_2 = /*row*/ ctx[10];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*renderers, $$restProps, rows*/ 104) {
    				each_value_2 = /*row*/ ctx[10];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t.parentNode, t);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(37:12) <svelte:component this={renderers.tablerow}>",
    		ctx
    	});

    	return block;
    }

    // (36:10) {#each rows as row}
    function create_each_block_1$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*renderers*/ ctx[5].tablerow;

    	function switch_props(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty & /*$$scope, rows, renderers, $$restProps*/ 8388712) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].tablerow)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(36:10) {#each rows as row}",
    		ctx
    	});

    	return block;
    }

    // (35:8) <svelte:component this={renderers.tablebody}>
    function create_default_slot_1$2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*rows*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*renderers, rows, $$restProps*/ 104) {
    				each_value_1 = /*rows*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(35:8) <svelte:component this={renderers.tablebody}>",
    		ctx
    	});

    	return block;
    }

    // (21:6) <svelte:component this={renderers.table}>
    function create_default_slot$6(ctx) {
    	let switch_instance0;
    	let t;
    	let switch_instance1;
    	let switch_instance1_anchor;
    	let current;
    	var switch_value = /*renderers*/ ctx[5].tablehead;

    	function switch_props(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance0 = new switch_value(switch_props(ctx));
    	}

    	var switch_value_1 = /*renderers*/ ctx[5].tablebody;

    	function switch_props_1(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value_1) {
    		switch_instance1 = new switch_value_1(switch_props_1(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance0) create_component(switch_instance0.$$.fragment);
    			t = space();
    			if (switch_instance1) create_component(switch_instance1.$$.fragment);
    			switch_instance1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance0) {
    				mount_component(switch_instance0, target, anchor);
    			}

    			insert_dev(target, t, anchor);

    			if (switch_instance1) {
    				mount_component(switch_instance1, target, anchor);
    			}

    			insert_dev(target, switch_instance1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance0_changes = {};

    			if (dirty & /*$$scope, renderers, header, $$restProps*/ 8388708) {
    				switch_instance0_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].tablehead)) {
    				if (switch_instance0) {
    					group_outros();
    					const old_component = switch_instance0;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance0 = new switch_value(switch_props(ctx));
    					create_component(switch_instance0.$$.fragment);
    					transition_in(switch_instance0.$$.fragment, 1);
    					mount_component(switch_instance0, t.parentNode, t);
    				} else {
    					switch_instance0 = null;
    				}
    			} else if (switch_value) {
    				switch_instance0.$set(switch_instance0_changes);
    			}

    			const switch_instance1_changes = {};

    			if (dirty & /*$$scope, rows, renderers, $$restProps*/ 8388712) {
    				switch_instance1_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value_1 !== (switch_value_1 = /*renderers*/ ctx[5].tablebody)) {
    				if (switch_instance1) {
    					group_outros();
    					const old_component = switch_instance1;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value_1) {
    					switch_instance1 = new switch_value_1(switch_props_1(ctx));
    					create_component(switch_instance1.$$.fragment);
    					transition_in(switch_instance1.$$.fragment, 1);
    					mount_component(switch_instance1, switch_instance1_anchor.parentNode, switch_instance1_anchor);
    				} else {
    					switch_instance1 = null;
    				}
    			} else if (switch_value_1) {
    				switch_instance1.$set(switch_instance1_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance0) transition_in(switch_instance0.$$.fragment, local);
    			if (switch_instance1) transition_in(switch_instance1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance0) transition_out(switch_instance0.$$.fragment, local);
    			if (switch_instance1) transition_out(switch_instance1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (switch_instance0) destroy_component(switch_instance0, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(switch_instance1_anchor);
    			if (switch_instance1) destroy_component(switch_instance1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(21:6) <svelte:component this={renderers.table}>",
    		ctx
    	});

    	return block;
    }

    // (15:2) {#each tokens as token}
    function create_each_block$4(ctx) {
    	let parser;
    	let current;
    	const parser_spread_levels = [/*token*/ ctx[7], { renderers: /*renderers*/ ctx[5] }];
    	let parser_props = {};

    	for (let i = 0; i < parser_spread_levels.length; i += 1) {
    		parser_props = assign(parser_props, parser_spread_levels[i]);
    	}

    	parser = new Parser$1({ props: parser_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parser_changes = (dirty & /*tokens, renderers*/ 34)
    			? get_spread_update(parser_spread_levels, [
    					dirty & /*tokens*/ 2 && get_spread_object(/*token*/ ctx[7]),
    					dirty & /*renderers*/ 32 && { renderers: /*renderers*/ ctx[5] }
    				])
    			: {};

    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(15:2) {#each tokens as token}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$z(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$a, create_if_block_1$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*type*/ ctx[0]) return 0;
    		if (/*renderers*/ ctx[5][/*type*/ ctx[0]]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	const omit_props_names = ["type","tokens","header","rows","ordered","renderers"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Parser', slots, []);
    	let { type = undefined } = $$props;
    	let { tokens = undefined } = $$props;
    	let { header = undefined } = $$props;
    	let { rows = undefined } = $$props;
    	let { ordered = false } = $$props;
    	let { renderers } = $$props;
    	supressWarnings();

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('type' in $$new_props) $$invalidate(0, type = $$new_props.type);
    		if ('tokens' in $$new_props) $$invalidate(1, tokens = $$new_props.tokens);
    		if ('header' in $$new_props) $$invalidate(2, header = $$new_props.header);
    		if ('rows' in $$new_props) $$invalidate(3, rows = $$new_props.rows);
    		if ('ordered' in $$new_props) $$invalidate(4, ordered = $$new_props.ordered);
    		if ('renderers' in $$new_props) $$invalidate(5, renderers = $$new_props.renderers);
    	};

    	$$self.$capture_state = () => ({
    		supressWarnings,
    		type,
    		tokens,
    		header,
    		rows,
    		ordered,
    		renderers
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('type' in $$props) $$invalidate(0, type = $$new_props.type);
    		if ('tokens' in $$props) $$invalidate(1, tokens = $$new_props.tokens);
    		if ('header' in $$props) $$invalidate(2, header = $$new_props.header);
    		if ('rows' in $$props) $$invalidate(3, rows = $$new_props.rows);
    		if ('ordered' in $$props) $$invalidate(4, ordered = $$new_props.ordered);
    		if ('renderers' in $$props) $$invalidate(5, renderers = $$new_props.renderers);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [type, tokens, header, rows, ordered, renderers, $$restProps];
    }

    class Parser$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {
    			type: 0,
    			tokens: 1,
    			header: 2,
    			rows: 3,
    			ordered: 4,
    			renderers: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Parser",
    			options,
    			id: create_fragment$z.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*renderers*/ ctx[5] === undefined && !('renderers' in props)) {
    			console.warn("<Parser> was created without expected prop 'renderers'");
    		}
    	}

    	get type() {
    		throw new Error("<Parser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Parser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tokens() {
    		throw new Error("<Parser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tokens(value) {
    		throw new Error("<Parser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get header() {
    		throw new Error("<Parser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set header(value) {
    		throw new Error("<Parser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<Parser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<Parser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ordered() {
    		throw new Error("<Parser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ordered(value) {
    		throw new Error("<Parser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderers() {
    		throw new Error("<Parser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderers(value) {
    		throw new Error("<Parser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * marked - a markdown parser
     * Copyright (c) 2011-2022, Christopher Jeffrey. (MIT Licensed)
     * https://github.com/markedjs/marked
     */

    /**
     * DO NOT EDIT THIS FILE
     * The code in this file is generated from files in ./src/
     */

    function getDefaults() {
      return {
        baseUrl: null,
        breaks: false,
        extensions: null,
        gfm: true,
        headerIds: true,
        headerPrefix: '',
        highlight: null,
        langPrefix: 'language-',
        mangle: true,
        pedantic: false,
        renderer: null,
        sanitize: false,
        sanitizer: null,
        silent: false,
        smartLists: false,
        smartypants: false,
        tokenizer: null,
        walkTokens: null,
        xhtml: false
      };
    }

    let defaults = getDefaults();

    function changeDefaults(newDefaults) {
      defaults = newDefaults;
    }

    /**
     * Helpers
     */
    const escapeTest = /[&<>"']/;
    const escapeReplace = /[&<>"']/g;
    const escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
    const escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
    const escapeReplacements = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    const getEscapeReplacement = (ch) => escapeReplacements[ch];
    function escape(html, encode) {
      if (encode) {
        if (escapeTest.test(html)) {
          return html.replace(escapeReplace, getEscapeReplacement);
        }
      } else {
        if (escapeTestNoEncode.test(html)) {
          return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
        }
      }

      return html;
    }

    const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

    /**
     * @param {string} html
     */
    function unescape(html) {
      // explicitly match decimal, hex, and named HTML entities
      return html.replace(unescapeTest, (_, n) => {
        n = n.toLowerCase();
        if (n === 'colon') return ':';
        if (n.charAt(0) === '#') {
          return n.charAt(1) === 'x'
            ? String.fromCharCode(parseInt(n.substring(2), 16))
            : String.fromCharCode(+n.substring(1));
        }
        return '';
      });
    }

    const caret = /(^|[^\[])\^/g;

    /**
     * @param {string | RegExp} regex
     * @param {string} opt
     */
    function edit(regex, opt) {
      regex = typeof regex === 'string' ? regex : regex.source;
      opt = opt || '';
      const obj = {
        replace: (name, val) => {
          val = val.source || val;
          val = val.replace(caret, '$1');
          regex = regex.replace(name, val);
          return obj;
        },
        getRegex: () => {
          return new RegExp(regex, opt);
        }
      };
      return obj;
    }

    const nonWordAndColonTest = /[^\w:]/g;
    const originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

    /**
     * @param {boolean} sanitize
     * @param {string} base
     * @param {string} href
     */
    function cleanUrl(sanitize, base, href) {
      if (sanitize) {
        let prot;
        try {
          prot = decodeURIComponent(unescape(href))
            .replace(nonWordAndColonTest, '')
            .toLowerCase();
        } catch (e) {
          return null;
        }
        if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
          return null;
        }
      }
      if (base && !originIndependentUrl.test(href)) {
        href = resolveUrl(base, href);
      }
      try {
        href = encodeURI(href).replace(/%25/g, '%');
      } catch (e) {
        return null;
      }
      return href;
    }

    const baseUrls = {};
    const justDomain = /^[^:]+:\/*[^/]*$/;
    const protocol = /^([^:]+:)[\s\S]*$/;
    const domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;

    /**
     * @param {string} base
     * @param {string} href
     */
    function resolveUrl(base, href) {
      if (!baseUrls[' ' + base]) {
        // we can ignore everything in base after the last slash of its path component,
        // but we might need to add _that_
        // https://tools.ietf.org/html/rfc3986#section-3
        if (justDomain.test(base)) {
          baseUrls[' ' + base] = base + '/';
        } else {
          baseUrls[' ' + base] = rtrim(base, '/', true);
        }
      }
      base = baseUrls[' ' + base];
      const relativeBase = base.indexOf(':') === -1;

      if (href.substring(0, 2) === '//') {
        if (relativeBase) {
          return href;
        }
        return base.replace(protocol, '$1') + href;
      } else if (href.charAt(0) === '/') {
        if (relativeBase) {
          return href;
        }
        return base.replace(domain, '$1') + href;
      } else {
        return base + href;
      }
    }

    const noopTest = { exec: function noopTest() {} };

    function merge(obj) {
      let i = 1,
        target,
        key;

      for (; i < arguments.length; i++) {
        target = arguments[i];
        for (key in target) {
          if (Object.prototype.hasOwnProperty.call(target, key)) {
            obj[key] = target[key];
          }
        }
      }

      return obj;
    }

    function splitCells(tableRow, count) {
      // ensure that every cell-delimiting pipe has a space
      // before it to distinguish it from an escaped pipe
      const row = tableRow.replace(/\|/g, (match, offset, str) => {
          let escaped = false,
            curr = offset;
          while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
          if (escaped) {
            // odd number of slashes means | is escaped
            // so we leave it alone
            return '|';
          } else {
            // add space before unescaped |
            return ' |';
          }
        }),
        cells = row.split(/ \|/);
      let i = 0;

      // First/last cell in a row cannot be empty if it has no leading/trailing pipe
      if (!cells[0].trim()) { cells.shift(); }
      if (cells.length > 0 && !cells[cells.length - 1].trim()) { cells.pop(); }

      if (cells.length > count) {
        cells.splice(count);
      } else {
        while (cells.length < count) cells.push('');
      }

      for (; i < cells.length; i++) {
        // leading or trailing whitespace is ignored per the gfm spec
        cells[i] = cells[i].trim().replace(/\\\|/g, '|');
      }
      return cells;
    }

    /**
     * Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
     * /c*$/ is vulnerable to REDOS.
     *
     * @param {string} str
     * @param {string} c
     * @param {boolean} invert Remove suffix of non-c chars instead. Default falsey.
     */
    function rtrim(str, c, invert) {
      const l = str.length;
      if (l === 0) {
        return '';
      }

      // Length of suffix matching the invert condition.
      let suffLen = 0;

      // Step left until we fail to match the invert condition.
      while (suffLen < l) {
        const currChar = str.charAt(l - suffLen - 1);
        if (currChar === c && !invert) {
          suffLen++;
        } else if (currChar !== c && invert) {
          suffLen++;
        } else {
          break;
        }
      }

      return str.slice(0, l - suffLen);
    }

    function findClosingBracket(str, b) {
      if (str.indexOf(b[1]) === -1) {
        return -1;
      }
      const l = str.length;
      let level = 0,
        i = 0;
      for (; i < l; i++) {
        if (str[i] === '\\') {
          i++;
        } else if (str[i] === b[0]) {
          level++;
        } else if (str[i] === b[1]) {
          level--;
          if (level < 0) {
            return i;
          }
        }
      }
      return -1;
    }

    function checkSanitizeDeprecation(opt) {
      if (opt && opt.sanitize && !opt.silent) {
        console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
      }
    }

    // copied from https://stackoverflow.com/a/5450113/806777
    /**
     * @param {string} pattern
     * @param {number} count
     */
    function repeatString(pattern, count) {
      if (count < 1) {
        return '';
      }
      let result = '';
      while (count > 1) {
        if (count & 1) {
          result += pattern;
        }
        count >>= 1;
        pattern += pattern;
      }
      return result + pattern;
    }

    function outputLink(cap, link, raw, lexer) {
      const href = link.href;
      const title = link.title ? escape(link.title) : null;
      const text = cap[1].replace(/\\([\[\]])/g, '$1');

      if (cap[0].charAt(0) !== '!') {
        lexer.state.inLink = true;
        const token = {
          type: 'link',
          raw,
          href,
          title,
          text,
          tokens: lexer.inlineTokens(text, [])
        };
        lexer.state.inLink = false;
        return token;
      }
      return {
        type: 'image',
        raw,
        href,
        title,
        text: escape(text)
      };
    }

    function indentCodeCompensation(raw, text) {
      const matchIndentToCode = raw.match(/^(\s+)(?:```)/);

      if (matchIndentToCode === null) {
        return text;
      }

      const indentToCode = matchIndentToCode[1];

      return text
        .split('\n')
        .map(node => {
          const matchIndentInNode = node.match(/^\s+/);
          if (matchIndentInNode === null) {
            return node;
          }

          const [indentInNode] = matchIndentInNode;

          if (indentInNode.length >= indentToCode.length) {
            return node.slice(indentToCode.length);
          }

          return node;
        })
        .join('\n');
    }

    /**
     * Tokenizer
     */
    class Tokenizer {
      constructor(options) {
        this.options = options || defaults;
      }

      space(src) {
        const cap = this.rules.block.newline.exec(src);
        if (cap && cap[0].length > 0) {
          return {
            type: 'space',
            raw: cap[0]
          };
        }
      }

      code(src) {
        const cap = this.rules.block.code.exec(src);
        if (cap) {
          const text = cap[0].replace(/^ {1,4}/gm, '');
          return {
            type: 'code',
            raw: cap[0],
            codeBlockStyle: 'indented',
            text: !this.options.pedantic
              ? rtrim(text, '\n')
              : text
          };
        }
      }

      fences(src) {
        const cap = this.rules.block.fences.exec(src);
        if (cap) {
          const raw = cap[0];
          const text = indentCodeCompensation(raw, cap[3] || '');

          return {
            type: 'code',
            raw,
            lang: cap[2] ? cap[2].trim() : cap[2],
            text
          };
        }
      }

      heading(src) {
        const cap = this.rules.block.heading.exec(src);
        if (cap) {
          let text = cap[2].trim();

          // remove trailing #s
          if (/#$/.test(text)) {
            const trimmed = rtrim(text, '#');
            if (this.options.pedantic) {
              text = trimmed.trim();
            } else if (!trimmed || / $/.test(trimmed)) {
              // CommonMark requires space before trailing #s
              text = trimmed.trim();
            }
          }

          const token = {
            type: 'heading',
            raw: cap[0],
            depth: cap[1].length,
            text,
            tokens: []
          };
          this.lexer.inline(token.text, token.tokens);
          return token;
        }
      }

      hr(src) {
        const cap = this.rules.block.hr.exec(src);
        if (cap) {
          return {
            type: 'hr',
            raw: cap[0]
          };
        }
      }

      blockquote(src) {
        const cap = this.rules.block.blockquote.exec(src);
        if (cap) {
          const text = cap[0].replace(/^ *>[ \t]?/gm, '');

          return {
            type: 'blockquote',
            raw: cap[0],
            tokens: this.lexer.blockTokens(text, []),
            text
          };
        }
      }

      list(src) {
        let cap = this.rules.block.list.exec(src);
        if (cap) {
          let raw, istask, ischecked, indent, i, blankLine, endsWithBlankLine,
            line, nextLine, rawLine, itemContents, endEarly;

          let bull = cap[1].trim();
          const isordered = bull.length > 1;

          const list = {
            type: 'list',
            raw: '',
            ordered: isordered,
            start: isordered ? +bull.slice(0, -1) : '',
            loose: false,
            items: []
          };

          bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;

          if (this.options.pedantic) {
            bull = isordered ? bull : '[*+-]';
          }

          // Get next list item
          const itemRegex = new RegExp(`^( {0,3}${bull})((?:[\t ][^\\n]*)?(?:\\n|$))`);

          // Check if current bullet point can start a new List Item
          while (src) {
            endEarly = false;
            if (!(cap = itemRegex.exec(src))) {
              break;
            }

            if (this.rules.block.hr.test(src)) { // End list if bullet was actually HR (possibly move into itemRegex?)
              break;
            }

            raw = cap[0];
            src = src.substring(raw.length);

            line = cap[2].split('\n', 1)[0];
            nextLine = src.split('\n', 1)[0];

            if (this.options.pedantic) {
              indent = 2;
              itemContents = line.trimLeft();
            } else {
              indent = cap[2].search(/[^ ]/); // Find first non-space char
              indent = indent > 4 ? 1 : indent; // Treat indented code blocks (> 4 spaces) as having only 1 indent
              itemContents = line.slice(indent);
              indent += cap[1].length;
            }

            blankLine = false;

            if (!line && /^ *$/.test(nextLine)) { // Items begin with at most one blank line
              raw += nextLine + '\n';
              src = src.substring(nextLine.length + 1);
              endEarly = true;
            }

            if (!endEarly) {
              const nextBulletRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?: [^\\n]*)?(?:\\n|$))`);
              const hrRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`);

              // Check if following lines should be included in List Item
              while (src) {
                rawLine = src.split('\n', 1)[0];
                line = rawLine;

                // Re-align to follow commonmark nesting rules
                if (this.options.pedantic) {
                  line = line.replace(/^ {1,4}(?=( {4})*[^ ])/g, '  ');
                }

                // End list item if found start of new bullet
                if (nextBulletRegex.test(line)) {
                  break;
                }

                // Horizontal rule found
                if (hrRegex.test(src)) {
                  break;
                }

                if (line.search(/[^ ]/) >= indent || !line.trim()) { // Dedent if possible
                  itemContents += '\n' + line.slice(indent);
                } else if (!blankLine) { // Until blank line, item doesn't need indentation
                  itemContents += '\n' + line;
                } else { // Otherwise, improper indentation ends this item
                  break;
                }

                if (!blankLine && !line.trim()) { // Check if current line is blank
                  blankLine = true;
                }

                raw += rawLine + '\n';
                src = src.substring(rawLine.length + 1);
              }
            }

            if (!list.loose) {
              // If the previous item ended with a blank line, the list is loose
              if (endsWithBlankLine) {
                list.loose = true;
              } else if (/\n *\n *$/.test(raw)) {
                endsWithBlankLine = true;
              }
            }

            // Check for task list items
            if (this.options.gfm) {
              istask = /^\[[ xX]\] /.exec(itemContents);
              if (istask) {
                ischecked = istask[0] !== '[ ] ';
                itemContents = itemContents.replace(/^\[[ xX]\] +/, '');
              }
            }

            list.items.push({
              type: 'list_item',
              raw,
              task: !!istask,
              checked: ischecked,
              loose: false,
              text: itemContents
            });

            list.raw += raw;
          }

          // Do not consume newlines at end of final item. Alternatively, make itemRegex *start* with any newlines to simplify/speed up endsWithBlankLine logic
          list.items[list.items.length - 1].raw = raw.trimRight();
          list.items[list.items.length - 1].text = itemContents.trimRight();
          list.raw = list.raw.trimRight();

          const l = list.items.length;

          // Item child tokens handled here at end because we needed to have the final item to trim it first
          for (i = 0; i < l; i++) {
            this.lexer.state.top = false;
            list.items[i].tokens = this.lexer.blockTokens(list.items[i].text, []);
            const spacers = list.items[i].tokens.filter(t => t.type === 'space');
            const hasMultipleLineBreaks = spacers.every(t => {
              const chars = t.raw.split('');
              let lineBreaks = 0;
              for (const char of chars) {
                if (char === '\n') {
                  lineBreaks += 1;
                }
                if (lineBreaks > 1) {
                  return true;
                }
              }

              return false;
            });

            if (!list.loose && spacers.length && hasMultipleLineBreaks) {
              // Having a single line break doesn't mean a list is loose. A single line break is terminating the last list item
              list.loose = true;
              list.items[i].loose = true;
            }
          }

          return list;
        }
      }

      html(src) {
        const cap = this.rules.block.html.exec(src);
        if (cap) {
          const token = {
            type: 'html',
            raw: cap[0],
            pre: !this.options.sanitizer
              && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
            text: cap[0]
          };
          if (this.options.sanitize) {
            token.type = 'paragraph';
            token.text = this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]);
            token.tokens = [];
            this.lexer.inline(token.text, token.tokens);
          }
          return token;
        }
      }

      def(src) {
        const cap = this.rules.block.def.exec(src);
        if (cap) {
          if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
          const tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
          return {
            type: 'def',
            tag,
            raw: cap[0],
            href: cap[2],
            title: cap[3]
          };
        }
      }

      table(src) {
        const cap = this.rules.block.table.exec(src);
        if (cap) {
          const item = {
            type: 'table',
            header: splitCells(cap[1]).map(c => { return { text: c }; }),
            align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
            rows: cap[3] && cap[3].trim() ? cap[3].replace(/\n[ \t]*$/, '').split('\n') : []
          };

          if (item.header.length === item.align.length) {
            item.raw = cap[0];

            let l = item.align.length;
            let i, j, k, row;
            for (i = 0; i < l; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = 'right';
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = 'center';
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = 'left';
              } else {
                item.align[i] = null;
              }
            }

            l = item.rows.length;
            for (i = 0; i < l; i++) {
              item.rows[i] = splitCells(item.rows[i], item.header.length).map(c => { return { text: c }; });
            }

            // parse child tokens inside headers and cells

            // header child tokens
            l = item.header.length;
            for (j = 0; j < l; j++) {
              item.header[j].tokens = [];
              this.lexer.inline(item.header[j].text, item.header[j].tokens);
            }

            // cell child tokens
            l = item.rows.length;
            for (j = 0; j < l; j++) {
              row = item.rows[j];
              for (k = 0; k < row.length; k++) {
                row[k].tokens = [];
                this.lexer.inline(row[k].text, row[k].tokens);
              }
            }

            return item;
          }
        }
      }

      lheading(src) {
        const cap = this.rules.block.lheading.exec(src);
        if (cap) {
          const token = {
            type: 'heading',
            raw: cap[0],
            depth: cap[2].charAt(0) === '=' ? 1 : 2,
            text: cap[1],
            tokens: []
          };
          this.lexer.inline(token.text, token.tokens);
          return token;
        }
      }

      paragraph(src) {
        const cap = this.rules.block.paragraph.exec(src);
        if (cap) {
          const token = {
            type: 'paragraph',
            raw: cap[0],
            text: cap[1].charAt(cap[1].length - 1) === '\n'
              ? cap[1].slice(0, -1)
              : cap[1],
            tokens: []
          };
          this.lexer.inline(token.text, token.tokens);
          return token;
        }
      }

      text(src) {
        const cap = this.rules.block.text.exec(src);
        if (cap) {
          const token = {
            type: 'text',
            raw: cap[0],
            text: cap[0],
            tokens: []
          };
          this.lexer.inline(token.text, token.tokens);
          return token;
        }
      }

      escape(src) {
        const cap = this.rules.inline.escape.exec(src);
        if (cap) {
          return {
            type: 'escape',
            raw: cap[0],
            text: escape(cap[1])
          };
        }
      }

      tag(src) {
        const cap = this.rules.inline.tag.exec(src);
        if (cap) {
          if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
            this.lexer.state.inLink = true;
          } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
            this.lexer.state.inLink = false;
          }
          if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            this.lexer.state.inRawBlock = true;
          } else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            this.lexer.state.inRawBlock = false;
          }

          return {
            type: this.options.sanitize
              ? 'text'
              : 'html',
            raw: cap[0],
            inLink: this.lexer.state.inLink,
            inRawBlock: this.lexer.state.inRawBlock,
            text: this.options.sanitize
              ? (this.options.sanitizer
                ? this.options.sanitizer(cap[0])
                : escape(cap[0]))
              : cap[0]
          };
        }
      }

      link(src) {
        const cap = this.rules.inline.link.exec(src);
        if (cap) {
          const trimmedUrl = cap[2].trim();
          if (!this.options.pedantic && /^</.test(trimmedUrl)) {
            // commonmark requires matching angle brackets
            if (!(/>$/.test(trimmedUrl))) {
              return;
            }

            // ending angle bracket cannot be escaped
            const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\');
            if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
              return;
            }
          } else {
            // find closing parenthesis
            const lastParenIndex = findClosingBracket(cap[2], '()');
            if (lastParenIndex > -1) {
              const start = cap[0].indexOf('!') === 0 ? 5 : 4;
              const linkLen = start + cap[1].length + lastParenIndex;
              cap[2] = cap[2].substring(0, lastParenIndex);
              cap[0] = cap[0].substring(0, linkLen).trim();
              cap[3] = '';
            }
          }
          let href = cap[2];
          let title = '';
          if (this.options.pedantic) {
            // split pedantic href and title
            const link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

            if (link) {
              href = link[1];
              title = link[3];
            }
          } else {
            title = cap[3] ? cap[3].slice(1, -1) : '';
          }

          href = href.trim();
          if (/^</.test(href)) {
            if (this.options.pedantic && !(/>$/.test(trimmedUrl))) {
              // pedantic allows starting angle bracket without ending angle bracket
              href = href.slice(1);
            } else {
              href = href.slice(1, -1);
            }
          }
          return outputLink(cap, {
            href: href ? href.replace(this.rules.inline._escapes, '$1') : href,
            title: title ? title.replace(this.rules.inline._escapes, '$1') : title
          }, cap[0], this.lexer);
        }
      }

      reflink(src, links) {
        let cap;
        if ((cap = this.rules.inline.reflink.exec(src))
            || (cap = this.rules.inline.nolink.exec(src))) {
          let link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
          link = links[link.toLowerCase()];
          if (!link || !link.href) {
            const text = cap[0].charAt(0);
            return {
              type: 'text',
              raw: text,
              text
            };
          }
          return outputLink(cap, link, cap[0], this.lexer);
        }
      }

      emStrong(src, maskedSrc, prevChar = '') {
        let match = this.rules.inline.emStrong.lDelim.exec(src);
        if (!match) return;

        // _ can't be between two alphanumerics. \p{L}\p{N} includes non-english alphabet/numbers as well
        if (match[3] && prevChar.match(/[\p{L}\p{N}]/u)) return;

        const nextChar = match[1] || match[2] || '';

        if (!nextChar || (nextChar && (prevChar === '' || this.rules.inline.punctuation.exec(prevChar)))) {
          const lLength = match[0].length - 1;
          let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;

          const endReg = match[0][0] === '*' ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
          endReg.lastIndex = 0;

          // Clip maskedSrc to same section of string as src (move to lexer?)
          maskedSrc = maskedSrc.slice(-1 * src.length + lLength);

          while ((match = endReg.exec(maskedSrc)) != null) {
            rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];

            if (!rDelim) continue; // skip single * in __abc*abc__

            rLength = rDelim.length;

            if (match[3] || match[4]) { // found another Left Delim
              delimTotal += rLength;
              continue;
            } else if (match[5] || match[6]) { // either Left or Right Delim
              if (lLength % 3 && !((lLength + rLength) % 3)) {
                midDelimTotal += rLength;
                continue; // CommonMark Emphasis Rules 9-10
              }
            }

            delimTotal -= rLength;

            if (delimTotal > 0) continue; // Haven't found enough closing delimiters

            // Remove extra characters. *a*** -> *a*
            rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);

            // Create `em` if smallest delimiter has odd char count. *a***
            if (Math.min(lLength, rLength) % 2) {
              const text = src.slice(1, lLength + match.index + rLength);
              return {
                type: 'em',
                raw: src.slice(0, lLength + match.index + rLength + 1),
                text,
                tokens: this.lexer.inlineTokens(text, [])
              };
            }

            // Create 'strong' if smallest delimiter has even char count. **a***
            const text = src.slice(2, lLength + match.index + rLength - 1);
            return {
              type: 'strong',
              raw: src.slice(0, lLength + match.index + rLength + 1),
              text,
              tokens: this.lexer.inlineTokens(text, [])
            };
          }
        }
      }

      codespan(src) {
        const cap = this.rules.inline.code.exec(src);
        if (cap) {
          let text = cap[2].replace(/\n/g, ' ');
          const hasNonSpaceChars = /[^ ]/.test(text);
          const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
          if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
            text = text.substring(1, text.length - 1);
          }
          text = escape(text, true);
          return {
            type: 'codespan',
            raw: cap[0],
            text
          };
        }
      }

      br(src) {
        const cap = this.rules.inline.br.exec(src);
        if (cap) {
          return {
            type: 'br',
            raw: cap[0]
          };
        }
      }

      del(src) {
        const cap = this.rules.inline.del.exec(src);
        if (cap) {
          return {
            type: 'del',
            raw: cap[0],
            text: cap[2],
            tokens: this.lexer.inlineTokens(cap[2], [])
          };
        }
      }

      autolink(src, mangle) {
        const cap = this.rules.inline.autolink.exec(src);
        if (cap) {
          let text, href;
          if (cap[2] === '@') {
            text = escape(this.options.mangle ? mangle(cap[1]) : cap[1]);
            href = 'mailto:' + text;
          } else {
            text = escape(cap[1]);
            href = text;
          }

          return {
            type: 'link',
            raw: cap[0],
            text,
            href,
            tokens: [
              {
                type: 'text',
                raw: text,
                text
              }
            ]
          };
        }
      }

      url(src, mangle) {
        let cap;
        if (cap = this.rules.inline.url.exec(src)) {
          let text, href;
          if (cap[2] === '@') {
            text = escape(this.options.mangle ? mangle(cap[0]) : cap[0]);
            href = 'mailto:' + text;
          } else {
            // do extended autolink path validation
            let prevCapZero;
            do {
              prevCapZero = cap[0];
              cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
            } while (prevCapZero !== cap[0]);
            text = escape(cap[0]);
            if (cap[1] === 'www.') {
              href = 'http://' + text;
            } else {
              href = text;
            }
          }
          return {
            type: 'link',
            raw: cap[0],
            text,
            href,
            tokens: [
              {
                type: 'text',
                raw: text,
                text
              }
            ]
          };
        }
      }

      inlineText(src, smartypants) {
        const cap = this.rules.inline.text.exec(src);
        if (cap) {
          let text;
          if (this.lexer.state.inRawBlock) {
            text = this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0])) : cap[0];
          } else {
            text = escape(this.options.smartypants ? smartypants(cap[0]) : cap[0]);
          }
          return {
            type: 'text',
            raw: cap[0],
            text
          };
        }
      }
    }

    /**
     * Block-Level Grammar
     */
    const block = {
      newline: /^(?: *(?:\n|$))+/,
      code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
      fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
      hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
      heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
      blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
      list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,
      html: '^ {0,3}(?:' // optional indentation
        + '<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
        + '|comment[^\\n]*(\\n+|$)' // (2)
        + '|<\\?[\\s\\S]*?(?:\\?>\\n*|$)' // (3)
        + '|<![A-Z][\\s\\S]*?(?:>\\n*|$)' // (4)
        + '|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)' // (5)
        + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (6)
        + '|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) open tag
        + '|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) closing tag
        + ')',
      def: /^ {0,3}\[(label)\]: *(?:\n *)?<?([^\s>]+)>?(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,
      table: noopTest,
      lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
      // regex template, placeholders will be replaced according to different paragraph
      // interruption rules of commonmark and the original markdown spec:
      _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
      text: /^[^\n]+/
    };

    block._label = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
    block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
    block.def = edit(block.def)
      .replace('label', block._label)
      .replace('title', block._title)
      .getRegex();

    block.bullet = /(?:[*+-]|\d{1,9}[.)])/;
    block.listItemStart = edit(/^( *)(bull) */)
      .replace('bull', block.bullet)
      .getRegex();

    block.list = edit(block.list)
      .replace(/bull/g, block.bullet)
      .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
      .replace('def', '\\n+(?=' + block.def.source + ')')
      .getRegex();

    block._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
      + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
      + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
      + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
      + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
      + '|track|ul';
    block._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
    block.html = edit(block.html, 'i')
      .replace('comment', block._comment)
      .replace('tag', block._tag)
      .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
      .getRegex();

    block.paragraph = edit(block._paragraph)
      .replace('hr', block.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
      .replace('|table', '')
      .replace('blockquote', ' {0,3}>')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
      .getRegex();

    block.blockquote = edit(block.blockquote)
      .replace('paragraph', block.paragraph)
      .getRegex();

    /**
     * Normal Block Grammar
     */

    block.normal = merge({}, block);

    /**
     * GFM Block Grammar
     */

    block.gfm = merge({}, block.normal, {
      table: '^ *([^\\n ].*\\|.*)\\n' // Header
        + ' {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?' // Align
        + '(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)' // Cells
    });

    block.gfm.table = edit(block.gfm.table)
      .replace('hr', block.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('blockquote', ' {0,3}>')
      .replace('code', ' {4}[^\\n]')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', block._tag) // tables can be interrupted by type (6) html blocks
      .getRegex();

    block.gfm.paragraph = edit(block._paragraph)
      .replace('hr', block.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
      .replace('table', block.gfm.table) // interrupt paragraphs with table
      .replace('blockquote', ' {0,3}>')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
      .getRegex();
    /**
     * Pedantic grammar (original John Gruber's loose markdown specification)
     */

    block.pedantic = merge({}, block.normal, {
      html: edit(
        '^ *(?:comment *(?:\\n|\\s*$)'
        + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
        + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
        .replace('comment', block._comment)
        .replace(/tag/g, '(?!(?:'
          + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
          + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
          + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
        .getRegex(),
      def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
      heading: /^(#{1,6})(.*)(?:\n+|$)/,
      fences: noopTest, // fences not supported
      paragraph: edit(block.normal._paragraph)
        .replace('hr', block.hr)
        .replace('heading', ' *#{1,6} *[^\n]')
        .replace('lheading', block.lheading)
        .replace('blockquote', ' {0,3}>')
        .replace('|fences', '')
        .replace('|list', '')
        .replace('|html', '')
        .getRegex()
    });

    /**
     * Inline-Level Grammar
     */
    const inline = {
      escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
      autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
      url: noopTest,
      tag: '^comment'
        + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
        + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
        + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
        + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
        + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
      link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
      reflink: /^!?\[(label)\]\[(ref)\]/,
      nolink: /^!?\[(ref)\](?:\[\])?/,
      reflinkSearch: 'reflink|nolink(?!\\()',
      emStrong: {
        lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
        //        (1) and (2) can only be a Right Delimiter. (3) and (4) can only be Left.  (5) and (6) can be either Left or Right.
        //          () Skip orphan inside strong  () Consume to delim (1) #***                (2) a***#, a***                   (3) #***a, ***a                 (4) ***#              (5) #***#                 (6) a***a
        rDelimAst: /^[^_*]*?\_\_[^_*]*?\*[^_*]*?(?=\_\_)|[^*]+(?=[^*])|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
        rDelimUnd: /^[^_*]*?\*\*[^_*]*?\_[^_*]*?(?=\*\*)|[^_]+(?=[^_])|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/ // ^- Not allowed for _
      },
      code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
      br: /^( {2,}|\\)\n(?!\s*$)/,
      del: noopTest,
      text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
      punctuation: /^([\spunctuation])/
    };

    // list of punctuation marks from CommonMark spec
    // without * and _ to handle the different emphasis markers * and _
    inline._punctuation = '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~';
    inline.punctuation = edit(inline.punctuation).replace(/punctuation/g, inline._punctuation).getRegex();

    // sequences em should skip over [title](link), `code`, <html>
    inline.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
    inline.escapedEmSt = /\\\*|\\_/g;

    inline._comment = edit(block._comment).replace('(?:-->|$)', '-->').getRegex();

    inline.emStrong.lDelim = edit(inline.emStrong.lDelim)
      .replace(/punct/g, inline._punctuation)
      .getRegex();

    inline.emStrong.rDelimAst = edit(inline.emStrong.rDelimAst, 'g')
      .replace(/punct/g, inline._punctuation)
      .getRegex();

    inline.emStrong.rDelimUnd = edit(inline.emStrong.rDelimUnd, 'g')
      .replace(/punct/g, inline._punctuation)
      .getRegex();

    inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

    inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
    inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
    inline.autolink = edit(inline.autolink)
      .replace('scheme', inline._scheme)
      .replace('email', inline._email)
      .getRegex();

    inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

    inline.tag = edit(inline.tag)
      .replace('comment', inline._comment)
      .replace('attribute', inline._attribute)
      .getRegex();

    inline._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
    inline._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
    inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

    inline.link = edit(inline.link)
      .replace('label', inline._label)
      .replace('href', inline._href)
      .replace('title', inline._title)
      .getRegex();

    inline.reflink = edit(inline.reflink)
      .replace('label', inline._label)
      .replace('ref', block._label)
      .getRegex();

    inline.nolink = edit(inline.nolink)
      .replace('ref', block._label)
      .getRegex();

    inline.reflinkSearch = edit(inline.reflinkSearch, 'g')
      .replace('reflink', inline.reflink)
      .replace('nolink', inline.nolink)
      .getRegex();

    /**
     * Normal Inline Grammar
     */

    inline.normal = merge({}, inline);

    /**
     * Pedantic Inline Grammar
     */

    inline.pedantic = merge({}, inline.normal, {
      strong: {
        start: /^__|\*\*/,
        middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        endAst: /\*\*(?!\*)/g,
        endUnd: /__(?!_)/g
      },
      em: {
        start: /^_|\*/,
        middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
        endAst: /\*(?!\*)/g,
        endUnd: /_(?!_)/g
      },
      link: edit(/^!?\[(label)\]\((.*?)\)/)
        .replace('label', inline._label)
        .getRegex(),
      reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
        .replace('label', inline._label)
        .getRegex()
    });

    /**
     * GFM Inline Grammar
     */

    inline.gfm = merge({}, inline.normal, {
      escape: edit(inline.escape).replace('])', '~|])').getRegex(),
      _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
      url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
      _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
      del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
      text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
    });

    inline.gfm.url = edit(inline.gfm.url, 'i')
      .replace('email', inline.gfm._extended_email)
      .getRegex();
    /**
     * GFM + Line Breaks Inline Grammar
     */

    inline.breaks = merge({}, inline.gfm, {
      br: edit(inline.br).replace('{2,}', '*').getRegex(),
      text: edit(inline.gfm.text)
        .replace('\\b_', '\\b_| {2,}\\n')
        .replace(/\{2,\}/g, '*')
        .getRegex()
    });

    /**
     * smartypants text replacement
     * @param {string} text
     */
    function smartypants(text) {
      return text
        // em-dashes
        .replace(/---/g, '\u2014')
        // en-dashes
        .replace(/--/g, '\u2013')
        // opening singles
        .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
        // closing singles & apostrophes
        .replace(/'/g, '\u2019')
        // opening doubles
        .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
        // closing doubles
        .replace(/"/g, '\u201d')
        // ellipses
        .replace(/\.{3}/g, '\u2026');
    }

    /**
     * mangle email addresses
     * @param {string} text
     */
    function mangle(text) {
      let out = '',
        i,
        ch;

      const l = text.length;
      for (i = 0; i < l; i++) {
        ch = text.charCodeAt(i);
        if (Math.random() > 0.5) {
          ch = 'x' + ch.toString(16);
        }
        out += '&#' + ch + ';';
      }

      return out;
    }

    /**
     * Block Lexer
     */
    class Lexer {
      constructor(options) {
        this.tokens = [];
        this.tokens.links = Object.create(null);
        this.options = options || defaults;
        this.options.tokenizer = this.options.tokenizer || new Tokenizer();
        this.tokenizer = this.options.tokenizer;
        this.tokenizer.options = this.options;
        this.tokenizer.lexer = this;
        this.inlineQueue = [];
        this.state = {
          inLink: false,
          inRawBlock: false,
          top: true
        };

        const rules = {
          block: block.normal,
          inline: inline.normal
        };

        if (this.options.pedantic) {
          rules.block = block.pedantic;
          rules.inline = inline.pedantic;
        } else if (this.options.gfm) {
          rules.block = block.gfm;
          if (this.options.breaks) {
            rules.inline = inline.breaks;
          } else {
            rules.inline = inline.gfm;
          }
        }
        this.tokenizer.rules = rules;
      }

      /**
       * Expose Rules
       */
      static get rules() {
        return {
          block,
          inline
        };
      }

      /**
       * Static Lex Method
       */
      static lex(src, options) {
        const lexer = new Lexer(options);
        return lexer.lex(src);
      }

      /**
       * Static Lex Inline Method
       */
      static lexInline(src, options) {
        const lexer = new Lexer(options);
        return lexer.inlineTokens(src);
      }

      /**
       * Preprocessing
       */
      lex(src) {
        src = src
          .replace(/\r\n|\r/g, '\n');

        this.blockTokens(src, this.tokens);

        let next;
        while (next = this.inlineQueue.shift()) {
          this.inlineTokens(next.src, next.tokens);
        }

        return this.tokens;
      }

      /**
       * Lexing
       */
      blockTokens(src, tokens = []) {
        if (this.options.pedantic) {
          src = src.replace(/\t/g, '    ').replace(/^ +$/gm, '');
        } else {
          src = src.replace(/^( *)(\t+)/gm, (_, leading, tabs) => {
            return leading + '    '.repeat(tabs.length);
          });
        }

        let token, lastToken, cutSrc, lastParagraphClipped;

        while (src) {
          if (this.options.extensions
            && this.options.extensions.block
            && this.options.extensions.block.some((extTokenizer) => {
              if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                return true;
              }
              return false;
            })) {
            continue;
          }

          // newline
          if (token = this.tokenizer.space(src)) {
            src = src.substring(token.raw.length);
            if (token.raw.length === 1 && tokens.length > 0) {
              // if there's a single \n as a spacer, it's terminating the last line,
              // so move it there so that we don't get unecessary paragraph tags
              tokens[tokens.length - 1].raw += '\n';
            } else {
              tokens.push(token);
            }
            continue;
          }

          // code
          if (token = this.tokenizer.code(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            // An indented code block cannot interrupt a paragraph.
            if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          // fences
          if (token = this.tokenizer.fences(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // heading
          if (token = this.tokenizer.heading(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // hr
          if (token = this.tokenizer.hr(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // blockquote
          if (token = this.tokenizer.blockquote(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // list
          if (token = this.tokenizer.list(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // html
          if (token = this.tokenizer.html(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // def
          if (token = this.tokenizer.def(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.raw;
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else if (!this.tokens.links[token.tag]) {
              this.tokens.links[token.tag] = {
                href: token.href,
                title: token.title
              };
            }
            continue;
          }

          // table (gfm)
          if (token = this.tokenizer.table(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // lheading
          if (token = this.tokenizer.lheading(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // top-level paragraph
          // prevent paragraph consuming extensions by clipping 'src' to extension start
          cutSrc = src;
          if (this.options.extensions && this.options.extensions.startBlock) {
            let startIndex = Infinity;
            const tempSrc = src.slice(1);
            let tempStart;
            this.options.extensions.startBlock.forEach(function(getStartIndex) {
              tempStart = getStartIndex.call({ lexer: this }, tempSrc);
              if (typeof tempStart === 'number' && tempStart >= 0) { startIndex = Math.min(startIndex, tempStart); }
            });
            if (startIndex < Infinity && startIndex >= 0) {
              cutSrc = src.substring(0, startIndex + 1);
            }
          }
          if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
            lastToken = tokens[tokens.length - 1];
            if (lastParagraphClipped && lastToken.type === 'paragraph') {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
              this.inlineQueue.pop();
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else {
              tokens.push(token);
            }
            lastParagraphClipped = (cutSrc.length !== src.length);
            src = src.substring(token.raw.length);
            continue;
          }

          // text
          if (token = this.tokenizer.text(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && lastToken.type === 'text') {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
              this.inlineQueue.pop();
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          if (src) {
            const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }

        this.state.top = true;
        return tokens;
      }

      inline(src, tokens) {
        this.inlineQueue.push({ src, tokens });
      }

      /**
       * Lexing/Compiling
       */
      inlineTokens(src, tokens = []) {
        let token, lastToken, cutSrc;

        // String with links masked to avoid interference with em and strong
        let maskedSrc = src;
        let match;
        let keepPrevChar, prevChar;

        // Mask out reflinks
        if (this.tokens.links) {
          const links = Object.keys(this.tokens.links);
          if (links.length > 0) {
            while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
              if (links.includes(match[0].slice(match[0].lastIndexOf('[') + 1, -1))) {
                maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
              }
            }
          }
        }
        // Mask out other blocks
        while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
          maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
        }

        // Mask out escaped em & strong delimiters
        while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
          maskedSrc = maskedSrc.slice(0, match.index) + '++' + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
        }

        while (src) {
          if (!keepPrevChar) {
            prevChar = '';
          }
          keepPrevChar = false;

          // extensions
          if (this.options.extensions
            && this.options.extensions.inline
            && this.options.extensions.inline.some((extTokenizer) => {
              if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                return true;
              }
              return false;
            })) {
            continue;
          }

          // escape
          if (token = this.tokenizer.escape(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // tag
          if (token = this.tokenizer.tag(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && token.type === 'text' && lastToken.type === 'text') {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          // link
          if (token = this.tokenizer.link(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // reflink, nolink
          if (token = this.tokenizer.reflink(src, this.tokens.links)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && token.type === 'text' && lastToken.type === 'text') {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          // em & strong
          if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // code
          if (token = this.tokenizer.codespan(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // br
          if (token = this.tokenizer.br(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // del (gfm)
          if (token = this.tokenizer.del(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // autolink
          if (token = this.tokenizer.autolink(src, mangle)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // url (gfm)
          if (!this.state.inLink && (token = this.tokenizer.url(src, mangle))) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // text
          // prevent inlineText consuming extensions by clipping 'src' to extension start
          cutSrc = src;
          if (this.options.extensions && this.options.extensions.startInline) {
            let startIndex = Infinity;
            const tempSrc = src.slice(1);
            let tempStart;
            this.options.extensions.startInline.forEach(function(getStartIndex) {
              tempStart = getStartIndex.call({ lexer: this }, tempSrc);
              if (typeof tempStart === 'number' && tempStart >= 0) { startIndex = Math.min(startIndex, tempStart); }
            });
            if (startIndex < Infinity && startIndex >= 0) {
              cutSrc = src.substring(0, startIndex + 1);
            }
          }
          if (token = this.tokenizer.inlineText(cutSrc, smartypants)) {
            src = src.substring(token.raw.length);
            if (token.raw.slice(-1) !== '_') { // Track prevChar before string of ____ started
              prevChar = token.raw.slice(-1);
            }
            keepPrevChar = true;
            lastToken = tokens[tokens.length - 1];
            if (lastToken && lastToken.type === 'text') {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          if (src) {
            const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }

        return tokens;
      }
    }

    /**
     * Renderer
     */
    class Renderer {
      constructor(options) {
        this.options = options || defaults;
      }

      code(code, infostring, escaped) {
        const lang = (infostring || '').match(/\S*/)[0];
        if (this.options.highlight) {
          const out = this.options.highlight(code, lang);
          if (out != null && out !== code) {
            escaped = true;
            code = out;
          }
        }

        code = code.replace(/\n$/, '') + '\n';

        if (!lang) {
          return '<pre><code>'
            + (escaped ? code : escape(code, true))
            + '</code></pre>\n';
        }

        return '<pre><code class="'
          + this.options.langPrefix
          + escape(lang, true)
          + '">'
          + (escaped ? code : escape(code, true))
          + '</code></pre>\n';
      }

      /**
       * @param {string} quote
       */
      blockquote(quote) {
        return `<blockquote>\n${quote}</blockquote>\n`;
      }

      html(html) {
        return html;
      }

      /**
       * @param {string} text
       * @param {string} level
       * @param {string} raw
       * @param {any} slugger
       */
      heading(text, level, raw, slugger) {
        if (this.options.headerIds) {
          const id = this.options.headerPrefix + slugger.slug(raw);
          return `<h${level} id="${id}">${text}</h${level}>\n`;
        }

        // ignore IDs
        return `<h${level}>${text}</h${level}>\n`;
      }

      hr() {
        return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
      }

      list(body, ordered, start) {
        const type = ordered ? 'ol' : 'ul',
          startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
        return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
      }

      /**
       * @param {string} text
       */
      listitem(text) {
        return `<li>${text}</li>\n`;
      }

      checkbox(checked) {
        return '<input '
          + (checked ? 'checked="" ' : '')
          + 'disabled="" type="checkbox"'
          + (this.options.xhtml ? ' /' : '')
          + '> ';
      }

      /**
       * @param {string} text
       */
      paragraph(text) {
        return `<p>${text}</p>\n`;
      }

      /**
       * @param {string} header
       * @param {string} body
       */
      table(header, body) {
        if (body) body = `<tbody>${body}</tbody>`;

        return '<table>\n'
          + '<thead>\n'
          + header
          + '</thead>\n'
          + body
          + '</table>\n';
      }

      /**
       * @param {string} content
       */
      tablerow(content) {
        return `<tr>\n${content}</tr>\n`;
      }

      tablecell(content, flags) {
        const type = flags.header ? 'th' : 'td';
        const tag = flags.align
          ? `<${type} align="${flags.align}">`
          : `<${type}>`;
        return tag + content + `</${type}>\n`;
      }

      /**
       * span level renderer
       * @param {string} text
       */
      strong(text) {
        return `<strong>${text}</strong>`;
      }

      /**
       * @param {string} text
       */
      em(text) {
        return `<em>${text}</em>`;
      }

      /**
       * @param {string} text
       */
      codespan(text) {
        return `<code>${text}</code>`;
      }

      br() {
        return this.options.xhtml ? '<br/>' : '<br>';
      }

      /**
       * @param {string} text
       */
      del(text) {
        return `<del>${text}</del>`;
      }

      /**
       * @param {string} href
       * @param {string} title
       * @param {string} text
       */
      link(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }
        let out = '<a href="' + escape(href) + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
      }

      /**
       * @param {string} href
       * @param {string} title
       * @param {string} text
       */
      image(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }

        let out = `<img src="${href}" alt="${text}"`;
        if (title) {
          out += ` title="${title}"`;
        }
        out += this.options.xhtml ? '/>' : '>';
        return out;
      }

      text(text) {
        return text;
      }
    }

    /**
     * TextRenderer
     * returns only the textual part of the token
     */
    class TextRenderer {
      // no need for block level renderers
      strong(text) {
        return text;
      }

      em(text) {
        return text;
      }

      codespan(text) {
        return text;
      }

      del(text) {
        return text;
      }

      html(text) {
        return text;
      }

      text(text) {
        return text;
      }

      link(href, title, text) {
        return '' + text;
      }

      image(href, title, text) {
        return '' + text;
      }

      br() {
        return '';
      }
    }

    /**
     * Slugger generates header id
     */
    class Slugger {
      constructor() {
        this.seen = {};
      }

      /**
       * @param {string} value
       */
      serialize(value) {
        return value
          .toLowerCase()
          .trim()
          // remove html tags
          .replace(/<[!\/a-z].*?>/ig, '')
          // remove unwanted chars
          .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
          .replace(/\s/g, '-');
      }

      /**
       * Finds the next safe (unique) slug to use
       * @param {string} originalSlug
       * @param {boolean} isDryRun
       */
      getNextSafeSlug(originalSlug, isDryRun) {
        let slug = originalSlug;
        let occurenceAccumulator = 0;
        if (this.seen.hasOwnProperty(slug)) {
          occurenceAccumulator = this.seen[originalSlug];
          do {
            occurenceAccumulator++;
            slug = originalSlug + '-' + occurenceAccumulator;
          } while (this.seen.hasOwnProperty(slug));
        }
        if (!isDryRun) {
          this.seen[originalSlug] = occurenceAccumulator;
          this.seen[slug] = 0;
        }
        return slug;
      }

      /**
       * Convert string to unique id
       * @param {object} [options]
       * @param {boolean} [options.dryrun] Generates the next unique slug without
       * updating the internal accumulator.
       */
      slug(value, options = {}) {
        const slug = this.serialize(value);
        return this.getNextSafeSlug(slug, options.dryrun);
      }
    }

    /**
     * Parsing & Compiling
     */
    class Parser {
      constructor(options) {
        this.options = options || defaults;
        this.options.renderer = this.options.renderer || new Renderer();
        this.renderer = this.options.renderer;
        this.renderer.options = this.options;
        this.textRenderer = new TextRenderer();
        this.slugger = new Slugger();
      }

      /**
       * Static Parse Method
       */
      static parse(tokens, options) {
        const parser = new Parser(options);
        return parser.parse(tokens);
      }

      /**
       * Static Parse Inline Method
       */
      static parseInline(tokens, options) {
        const parser = new Parser(options);
        return parser.parseInline(tokens);
      }

      /**
       * Parse Loop
       */
      parse(tokens, top = true) {
        let out = '',
          i,
          j,
          k,
          l2,
          l3,
          row,
          cell,
          header,
          body,
          token,
          ordered,
          start,
          loose,
          itemBody,
          item,
          checked,
          task,
          checkbox,
          ret;

        const l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];

          // Run any renderer extensions
          if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
            ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
            if (ret !== false || !['space', 'hr', 'heading', 'code', 'table', 'blockquote', 'list', 'html', 'paragraph', 'text'].includes(token.type)) {
              out += ret || '';
              continue;
            }
          }

          switch (token.type) {
            case 'space': {
              continue;
            }
            case 'hr': {
              out += this.renderer.hr();
              continue;
            }
            case 'heading': {
              out += this.renderer.heading(
                this.parseInline(token.tokens),
                token.depth,
                unescape(this.parseInline(token.tokens, this.textRenderer)),
                this.slugger);
              continue;
            }
            case 'code': {
              out += this.renderer.code(token.text,
                token.lang,
                token.escaped);
              continue;
            }
            case 'table': {
              header = '';

              // header
              cell = '';
              l2 = token.header.length;
              for (j = 0; j < l2; j++) {
                cell += this.renderer.tablecell(
                  this.parseInline(token.header[j].tokens),
                  { header: true, align: token.align[j] }
                );
              }
              header += this.renderer.tablerow(cell);

              body = '';
              l2 = token.rows.length;
              for (j = 0; j < l2; j++) {
                row = token.rows[j];

                cell = '';
                l3 = row.length;
                for (k = 0; k < l3; k++) {
                  cell += this.renderer.tablecell(
                    this.parseInline(row[k].tokens),
                    { header: false, align: token.align[k] }
                  );
                }

                body += this.renderer.tablerow(cell);
              }
              out += this.renderer.table(header, body);
              continue;
            }
            case 'blockquote': {
              body = this.parse(token.tokens);
              out += this.renderer.blockquote(body);
              continue;
            }
            case 'list': {
              ordered = token.ordered;
              start = token.start;
              loose = token.loose;
              l2 = token.items.length;

              body = '';
              for (j = 0; j < l2; j++) {
                item = token.items[j];
                checked = item.checked;
                task = item.task;

                itemBody = '';
                if (item.task) {
                  checkbox = this.renderer.checkbox(checked);
                  if (loose) {
                    if (item.tokens.length > 0 && item.tokens[0].type === 'paragraph') {
                      item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;
                      if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                        item.tokens[0].tokens[0].text = checkbox + ' ' + item.tokens[0].tokens[0].text;
                      }
                    } else {
                      item.tokens.unshift({
                        type: 'text',
                        text: checkbox
                      });
                    }
                  } else {
                    itemBody += checkbox;
                  }
                }

                itemBody += this.parse(item.tokens, loose);
                body += this.renderer.listitem(itemBody, task, checked);
              }

              out += this.renderer.list(body, ordered, start);
              continue;
            }
            case 'html': {
              // TODO parse inline content if parameter markdown=1
              out += this.renderer.html(token.text);
              continue;
            }
            case 'paragraph': {
              out += this.renderer.paragraph(this.parseInline(token.tokens));
              continue;
            }
            case 'text': {
              body = token.tokens ? this.parseInline(token.tokens) : token.text;
              while (i + 1 < l && tokens[i + 1].type === 'text') {
                token = tokens[++i];
                body += '\n' + (token.tokens ? this.parseInline(token.tokens) : token.text);
              }
              out += top ? this.renderer.paragraph(body) : body;
              continue;
            }

            default: {
              const errMsg = 'Token with "' + token.type + '" type was not found.';
              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
          }
        }

        return out;
      }

      /**
       * Parse Inline Tokens
       */
      parseInline(tokens, renderer) {
        renderer = renderer || this.renderer;
        let out = '',
          i,
          token,
          ret;

        const l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];

          // Run any renderer extensions
          if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
            ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
            if (ret !== false || !['escape', 'html', 'link', 'image', 'strong', 'em', 'codespan', 'br', 'del', 'text'].includes(token.type)) {
              out += ret || '';
              continue;
            }
          }

          switch (token.type) {
            case 'escape': {
              out += renderer.text(token.text);
              break;
            }
            case 'html': {
              out += renderer.html(token.text);
              break;
            }
            case 'link': {
              out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
              break;
            }
            case 'image': {
              out += renderer.image(token.href, token.title, token.text);
              break;
            }
            case 'strong': {
              out += renderer.strong(this.parseInline(token.tokens, renderer));
              break;
            }
            case 'em': {
              out += renderer.em(this.parseInline(token.tokens, renderer));
              break;
            }
            case 'codespan': {
              out += renderer.codespan(token.text);
              break;
            }
            case 'br': {
              out += renderer.br();
              break;
            }
            case 'del': {
              out += renderer.del(this.parseInline(token.tokens, renderer));
              break;
            }
            case 'text': {
              out += renderer.text(token.text);
              break;
            }
            default: {
              const errMsg = 'Token with "' + token.type + '" type was not found.';
              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
          }
        }
        return out;
      }
    }

    /**
     * Marked
     */
    function marked(src, opt, callback) {
      // throw error in case of non string input
      if (typeof src === 'undefined' || src === null) {
        throw new Error('marked(): input parameter is undefined or null');
      }
      if (typeof src !== 'string') {
        throw new Error('marked(): input parameter is of type '
          + Object.prototype.toString.call(src) + ', string expected');
      }

      if (typeof opt === 'function') {
        callback = opt;
        opt = null;
      }

      opt = merge({}, marked.defaults, opt || {});
      checkSanitizeDeprecation(opt);

      if (callback) {
        const highlight = opt.highlight;
        let tokens;

        try {
          tokens = Lexer.lex(src, opt);
        } catch (e) {
          return callback(e);
        }

        const done = function(err) {
          let out;

          if (!err) {
            try {
              if (opt.walkTokens) {
                marked.walkTokens(tokens, opt.walkTokens);
              }
              out = Parser.parse(tokens, opt);
            } catch (e) {
              err = e;
            }
          }

          opt.highlight = highlight;

          return err
            ? callback(err)
            : callback(null, out);
        };

        if (!highlight || highlight.length < 3) {
          return done();
        }

        delete opt.highlight;

        if (!tokens.length) return done();

        let pending = 0;
        marked.walkTokens(tokens, function(token) {
          if (token.type === 'code') {
            pending++;
            setTimeout(() => {
              highlight(token.text, token.lang, function(err, code) {
                if (err) {
                  return done(err);
                }
                if (code != null && code !== token.text) {
                  token.text = code;
                  token.escaped = true;
                }

                pending--;
                if (pending === 0) {
                  done();
                }
              });
            }, 0);
          }
        });

        if (pending === 0) {
          done();
        }

        return;
      }

      try {
        const tokens = Lexer.lex(src, opt);
        if (opt.walkTokens) {
          marked.walkTokens(tokens, opt.walkTokens);
        }
        return Parser.parse(tokens, opt);
      } catch (e) {
        e.message += '\nPlease report this to https://github.com/markedjs/marked.';
        if (opt.silent) {
          return '<p>An error occurred:</p><pre>'
            + escape(e.message + '', true)
            + '</pre>';
        }
        throw e;
      }
    }

    /**
     * Options
     */

    marked.options =
    marked.setOptions = function(opt) {
      merge(marked.defaults, opt);
      changeDefaults(marked.defaults);
      return marked;
    };

    marked.getDefaults = getDefaults;

    marked.defaults = defaults;

    /**
     * Use Extension
     */

    marked.use = function(...args) {
      const opts = merge({}, ...args);
      const extensions = marked.defaults.extensions || { renderers: {}, childTokens: {} };
      let hasExtensions;

      args.forEach((pack) => {
        // ==-- Parse "addon" extensions --== //
        if (pack.extensions) {
          hasExtensions = true;
          pack.extensions.forEach((ext) => {
            if (!ext.name) {
              throw new Error('extension name required');
            }
            if (ext.renderer) { // Renderer extensions
              const prevRenderer = extensions.renderers ? extensions.renderers[ext.name] : null;
              if (prevRenderer) {
                // Replace extension with func to run new extension but fall back if false
                extensions.renderers[ext.name] = function(...args) {
                  let ret = ext.renderer.apply(this, args);
                  if (ret === false) {
                    ret = prevRenderer.apply(this, args);
                  }
                  return ret;
                };
              } else {
                extensions.renderers[ext.name] = ext.renderer;
              }
            }
            if (ext.tokenizer) { // Tokenizer Extensions
              if (!ext.level || (ext.level !== 'block' && ext.level !== 'inline')) {
                throw new Error("extension level must be 'block' or 'inline'");
              }
              if (extensions[ext.level]) {
                extensions[ext.level].unshift(ext.tokenizer);
              } else {
                extensions[ext.level] = [ext.tokenizer];
              }
              if (ext.start) { // Function to check for start of token
                if (ext.level === 'block') {
                  if (extensions.startBlock) {
                    extensions.startBlock.push(ext.start);
                  } else {
                    extensions.startBlock = [ext.start];
                  }
                } else if (ext.level === 'inline') {
                  if (extensions.startInline) {
                    extensions.startInline.push(ext.start);
                  } else {
                    extensions.startInline = [ext.start];
                  }
                }
              }
            }
            if (ext.childTokens) { // Child tokens to be visited by walkTokens
              extensions.childTokens[ext.name] = ext.childTokens;
            }
          });
        }

        // ==-- Parse "overwrite" extensions --== //
        if (pack.renderer) {
          const renderer = marked.defaults.renderer || new Renderer();
          for (const prop in pack.renderer) {
            const prevRenderer = renderer[prop];
            // Replace renderer with func to run extension, but fall back if false
            renderer[prop] = (...args) => {
              let ret = pack.renderer[prop].apply(renderer, args);
              if (ret === false) {
                ret = prevRenderer.apply(renderer, args);
              }
              return ret;
            };
          }
          opts.renderer = renderer;
        }
        if (pack.tokenizer) {
          const tokenizer = marked.defaults.tokenizer || new Tokenizer();
          for (const prop in pack.tokenizer) {
            const prevTokenizer = tokenizer[prop];
            // Replace tokenizer with func to run extension, but fall back if false
            tokenizer[prop] = (...args) => {
              let ret = pack.tokenizer[prop].apply(tokenizer, args);
              if (ret === false) {
                ret = prevTokenizer.apply(tokenizer, args);
              }
              return ret;
            };
          }
          opts.tokenizer = tokenizer;
        }

        // ==-- Parse WalkTokens extensions --== //
        if (pack.walkTokens) {
          const walkTokens = marked.defaults.walkTokens;
          opts.walkTokens = function(token) {
            pack.walkTokens.call(this, token);
            if (walkTokens) {
              walkTokens.call(this, token);
            }
          };
        }

        if (hasExtensions) {
          opts.extensions = extensions;
        }

        marked.setOptions(opts);
      });
    };

    /**
     * Run callback for every token
     */

    marked.walkTokens = function(tokens, callback) {
      for (const token of tokens) {
        callback.call(marked, token);
        switch (token.type) {
          case 'table': {
            for (const cell of token.header) {
              marked.walkTokens(cell.tokens, callback);
            }
            for (const row of token.rows) {
              for (const cell of row) {
                marked.walkTokens(cell.tokens, callback);
              }
            }
            break;
          }
          case 'list': {
            marked.walkTokens(token.items, callback);
            break;
          }
          default: {
            if (marked.defaults.extensions && marked.defaults.extensions.childTokens && marked.defaults.extensions.childTokens[token.type]) { // Walk any extensions
              marked.defaults.extensions.childTokens[token.type].forEach(function(childTokens) {
                marked.walkTokens(token[childTokens], callback);
              });
            } else if (token.tokens) {
              marked.walkTokens(token.tokens, callback);
            }
          }
        }
      }
    };

    /**
     * Parse Inline
     * @param {string} src
     */
    marked.parseInline = function(src, opt) {
      // throw error in case of non string input
      if (typeof src === 'undefined' || src === null) {
        throw new Error('marked.parseInline(): input parameter is undefined or null');
      }
      if (typeof src !== 'string') {
        throw new Error('marked.parseInline(): input parameter is of type '
          + Object.prototype.toString.call(src) + ', string expected');
      }

      opt = merge({}, marked.defaults, opt || {});
      checkSanitizeDeprecation(opt);

      try {
        const tokens = Lexer.lexInline(src, opt);
        if (opt.walkTokens) {
          marked.walkTokens(tokens, opt.walkTokens);
        }
        return Parser.parseInline(tokens, opt);
      } catch (e) {
        e.message += '\nPlease report this to https://github.com/markedjs/marked.';
        if (opt.silent) {
          return '<p>An error occurred:</p><pre>'
            + escape(e.message + '', true)
            + '</pre>';
        }
        throw e;
      }
    };

    /**
     * Expose
     */
    marked.Parser = Parser;
    marked.parser = Parser.parse;
    marked.Renderer = Renderer;
    marked.TextRenderer = TextRenderer;
    marked.Lexer = Lexer;
    marked.lexer = Lexer.lex;
    marked.Tokenizer = Tokenizer;
    marked.Slugger = Slugger;
    marked.parse = marked;

    marked.options;
    marked.setOptions;
    marked.use;
    marked.walkTokens;
    marked.parseInline;
    Parser.parse;
    Lexer.lex;

    const key = {};

    /* node_modules/svelte-markdown/src/renderers/Heading.svelte generated by Svelte v3.48.0 */
    const file$v = "node_modules/svelte-markdown/src/renderers/Heading.svelte";

    // (28:0) {:else}
    function create_else_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*raw*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*raw*/ 2) set_data_dev(t, /*raw*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(28:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (26:22) 
    function create_if_block_5(ctx) {
    	let h6;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			if (default_slot) default_slot.c();
    			attr_dev(h6, "id", /*id*/ ctx[2]);
    			add_location(h6, file$v, 26, 2, 596);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);

    			if (default_slot) {
    				default_slot.m(h6, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(h6, "id", /*id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(26:22) ",
    		ctx
    	});

    	return block;
    }

    // (24:22) 
    function create_if_block_4(ctx) {
    	let h5;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			if (default_slot) default_slot.c();
    			attr_dev(h5, "id", /*id*/ ctx[2]);
    			add_location(h5, file$v, 24, 2, 543);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);

    			if (default_slot) {
    				default_slot.m(h5, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(h5, "id", /*id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(24:22) ",
    		ctx
    	});

    	return block;
    }

    // (22:22) 
    function create_if_block_3$2(ctx) {
    	let h4;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			if (default_slot) default_slot.c();
    			attr_dev(h4, "id", /*id*/ ctx[2]);
    			add_location(h4, file$v, 22, 2, 490);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);

    			if (default_slot) {
    				default_slot.m(h4, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(h4, "id", /*id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(22:22) ",
    		ctx
    	});

    	return block;
    }

    // (20:22) 
    function create_if_block_2$3(ctx) {
    	let h3;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			if (default_slot) default_slot.c();
    			attr_dev(h3, "id", /*id*/ ctx[2]);
    			add_location(h3, file$v, 20, 2, 437);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);

    			if (default_slot) {
    				default_slot.m(h3, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(h3, "id", /*id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(20:22) ",
    		ctx
    	});

    	return block;
    }

    // (18:22) 
    function create_if_block_1$4(ctx) {
    	let h2;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			if (default_slot) default_slot.c();
    			attr_dev(h2, "id", /*id*/ ctx[2]);
    			add_location(h2, file$v, 18, 2, 384);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);

    			if (default_slot) {
    				default_slot.m(h2, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(h2, "id", /*id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(18:22) ",
    		ctx
    	});

    	return block;
    }

    // (16:0) {#if depth === 1}
    function create_if_block$9(ctx) {
    	let h1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			if (default_slot) default_slot.c();
    			attr_dev(h1, "id", /*id*/ ctx[2]);
    			add_location(h1, file$v, 16, 2, 331);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);

    			if (default_slot) {
    				default_slot.m(h1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(h1, "id", /*id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(16:0) {#if depth === 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	const if_block_creators = [
    		create_if_block$9,
    		create_if_block_1$4,
    		create_if_block_2$3,
    		create_if_block_3$2,
    		create_if_block_4,
    		create_if_block_5,
    		create_else_block$5
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*depth*/ ctx[0] === 1) return 0;
    		if (/*depth*/ ctx[0] === 2) return 1;
    		if (/*depth*/ ctx[0] === 3) return 2;
    		if (/*depth*/ ctx[0] === 4) return 3;
    		if (/*depth*/ ctx[0] === 5) return 4;
    		if (/*depth*/ ctx[0] === 6) return 5;
    		return 6;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	let id;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Heading', slots, ['default']);
    	let { depth } = $$props;
    	let { raw } = $$props;
    	let { text } = $$props;
    	const { slug, getOptions } = getContext(key);
    	const options = getOptions();
    	const writable_props = ['depth', 'raw', 'text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Heading> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('depth' in $$props) $$invalidate(0, depth = $$props.depth);
    		if ('raw' in $$props) $$invalidate(1, raw = $$props.raw);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		key,
    		depth,
    		raw,
    		text,
    		slug,
    		getOptions,
    		options,
    		id
    	});

    	$$self.$inject_state = $$props => {
    		if ('depth' in $$props) $$invalidate(0, depth = $$props.depth);
    		if ('raw' in $$props) $$invalidate(1, raw = $$props.raw);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*text*/ 8) {
    			$$invalidate(2, id = options.headerIds
    			? options.headerPrefix + slug(text)
    			: undefined);
    		}
    	};

    	return [depth, raw, id, text, $$scope, slots];
    }

    class Heading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, { depth: 0, raw: 1, text: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Heading",
    			options,
    			id: create_fragment$y.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*depth*/ ctx[0] === undefined && !('depth' in props)) {
    			console.warn("<Heading> was created without expected prop 'depth'");
    		}

    		if (/*raw*/ ctx[1] === undefined && !('raw' in props)) {
    			console.warn("<Heading> was created without expected prop 'raw'");
    		}

    		if (/*text*/ ctx[3] === undefined && !('text' in props)) {
    			console.warn("<Heading> was created without expected prop 'text'");
    		}
    	}

    	get depth() {
    		throw new Error("<Heading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set depth(value) {
    		throw new Error("<Heading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get raw() {
    		throw new Error("<Heading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set raw(value) {
    		throw new Error("<Heading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Heading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Heading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Paragraph.svelte generated by Svelte v3.48.0 */

    const file$u = "node_modules/svelte-markdown/src/renderers/Paragraph.svelte";

    function create_fragment$x(ctx) {
    	let p;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			p = element("p");
    			if (default_slot) default_slot.c();
    			add_location(p, file$u, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);

    			if (default_slot) {
    				default_slot.m(p, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Paragraph', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Paragraph> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Paragraph extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Paragraph",
    			options,
    			id: create_fragment$x.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Text.svelte generated by Svelte v3.48.0 */

    function create_fragment$w(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Text', slots, ['default']);
    	let { text } = $$props;
    	let { raw } = $$props;
    	const writable_props = ['text', 'raw'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Text> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('raw' in $$props) $$invalidate(1, raw = $$props.raw);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ text, raw });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('raw' in $$props) $$invalidate(1, raw = $$props.raw);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, raw, $$scope, slots];
    }

    class Text extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { text: 0, raw: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Text",
    			options,
    			id: create_fragment$w.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<Text> was created without expected prop 'text'");
    		}

    		if (/*raw*/ ctx[1] === undefined && !('raw' in props)) {
    			console.warn("<Text> was created without expected prop 'raw'");
    		}
    	}

    	get text() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get raw() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set raw(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Image.svelte generated by Svelte v3.48.0 */

    const file$t = "node_modules/svelte-markdown/src/renderers/Image.svelte";

    function create_fragment$v(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*href*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "title", /*title*/ ctx[1]);
    			attr_dev(img, "alt", /*text*/ ctx[2]);
    			add_location(img, file$t, 6, 0, 97);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*href*/ 1 && !src_url_equal(img.src, img_src_value = /*href*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*title*/ 2) {
    				attr_dev(img, "title", /*title*/ ctx[1]);
    			}

    			if (dirty & /*text*/ 4) {
    				attr_dev(img, "alt", /*text*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Image', slots, []);
    	let { href = '' } = $$props;
    	let { title = undefined } = $$props;
    	let { text = '' } = $$props;
    	const writable_props = ['href', 'title', 'text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Image> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ href, title, text });

    	$$self.$inject_state = $$props => {
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [href, title, text];
    }

    class Image extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, { href: 0, title: 1, text: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get href() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Link.svelte generated by Svelte v3.48.0 */

    const file$s = "node_modules/svelte-markdown/src/renderers/Link.svelte";

    function create_fragment$u(ctx) {
    	let a;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			attr_dev(a, "href", /*href*/ ctx[0]);
    			attr_dev(a, "title", /*title*/ ctx[1]);
    			add_location(a, file$s, 5, 0, 74);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*href*/ 1) {
    				attr_dev(a, "href", /*href*/ ctx[0]);
    			}

    			if (!current || dirty & /*title*/ 2) {
    				attr_dev(a, "title", /*title*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { href = '' } = $$props;
    	let { title = undefined } = $$props;
    	const writable_props = ['href', 'title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Link> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ href, title });

    	$$self.$inject_state = $$props => {
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [href, title, $$scope, slots];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, { href: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get href() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Em.svelte generated by Svelte v3.48.0 */

    const file$r = "node_modules/svelte-markdown/src/renderers/Em.svelte";

    function create_fragment$t(ctx) {
    	let em;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			em = element("em");
    			if (default_slot) default_slot.c();
    			add_location(em, file$r, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, em, anchor);

    			if (default_slot) {
    				default_slot.m(em, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(em);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Em', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Em> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Em extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Em",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Del.svelte generated by Svelte v3.48.0 */

    const file$q = "node_modules/svelte-markdown/src/renderers/Del.svelte";

    function create_fragment$s(ctx) {
    	let del;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			del = element("del");
    			if (default_slot) default_slot.c();
    			add_location(del, file$q, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, del, anchor);

    			if (default_slot) {
    				default_slot.m(del, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(del);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Del', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Del> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Del extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Del",
    			options,
    			id: create_fragment$s.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Codespan.svelte generated by Svelte v3.48.0 */

    const file$p = "node_modules/svelte-markdown/src/renderers/Codespan.svelte";

    function create_fragment$r(ctx) {
    	let code;
    	let t_value = /*raw*/ ctx[0].replace(/`/g, '') + "";
    	let t;

    	const block = {
    		c: function create() {
    			code = element("code");
    			t = text(t_value);
    			add_location(code, file$p, 4, 0, 37);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, code, anchor);
    			append_dev(code, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*raw*/ 1 && t_value !== (t_value = /*raw*/ ctx[0].replace(/`/g, '') + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(code);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Codespan', slots, []);
    	let { raw } = $$props;
    	const writable_props = ['raw'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Codespan> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('raw' in $$props) $$invalidate(0, raw = $$props.raw);
    	};

    	$$self.$capture_state = () => ({ raw });

    	$$self.$inject_state = $$props => {
    		if ('raw' in $$props) $$invalidate(0, raw = $$props.raw);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [raw];
    }

    class Codespan extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { raw: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Codespan",
    			options,
    			id: create_fragment$r.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*raw*/ ctx[0] === undefined && !('raw' in props)) {
    			console.warn("<Codespan> was created without expected prop 'raw'");
    		}
    	}

    	get raw() {
    		throw new Error("<Codespan>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set raw(value) {
    		throw new Error("<Codespan>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Strong.svelte generated by Svelte v3.48.0 */

    const file$o = "node_modules/svelte-markdown/src/renderers/Strong.svelte";

    function create_fragment$q(ctx) {
    	let strong;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			strong = element("strong");
    			if (default_slot) default_slot.c();
    			add_location(strong, file$o, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, strong, anchor);

    			if (default_slot) {
    				default_slot.m(strong, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(strong);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Strong', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Strong> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Strong extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Strong",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Table.svelte generated by Svelte v3.48.0 */

    const file$n = "node_modules/svelte-markdown/src/renderers/Table.svelte";

    function create_fragment$p(ctx) {
    	let table;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			table = element("table");
    			if (default_slot) default_slot.c();
    			add_location(table, file$n, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/TableHead.svelte generated by Svelte v3.48.0 */

    const file$m = "node_modules/svelte-markdown/src/renderers/TableHead.svelte";

    function create_fragment$o(ctx) {
    	let thead;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			if (default_slot) default_slot.c();
    			add_location(thead, file$m, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);

    			if (default_slot) {
    				default_slot.m(thead, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableHead', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TableHead> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class TableHead extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableHead",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/TableBody.svelte generated by Svelte v3.48.0 */

    const file$l = "node_modules/svelte-markdown/src/renderers/TableBody.svelte";

    function create_fragment$n(ctx) {
    	let tbody;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			tbody = element("tbody");
    			if (default_slot) default_slot.c();
    			add_location(tbody, file$l, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);

    			if (default_slot) {
    				default_slot.m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableBody', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TableBody> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class TableBody extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableBody",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/TableRow.svelte generated by Svelte v3.48.0 */

    const file$k = "node_modules/svelte-markdown/src/renderers/TableRow.svelte";

    function create_fragment$m(ctx) {
    	let tr;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			if (default_slot) default_slot.c();
    			add_location(tr, file$k, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			if (default_slot) {
    				default_slot.m(tr, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableRow', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TableRow> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class TableRow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableRow",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/TableCell.svelte generated by Svelte v3.48.0 */

    const file$j = "node_modules/svelte-markdown/src/renderers/TableCell.svelte";

    // (8:0) {:else}
    function create_else_block$4(ctx) {
    	let td;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			td = element("td");
    			if (default_slot) default_slot.c();
    			attr_dev(td, "align", /*align*/ ctx[1]);
    			add_location(td, file$j, 8, 2, 115);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);

    			if (default_slot) {
    				default_slot.m(td, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*align*/ 2) {
    				attr_dev(td, "align", /*align*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(8:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (6:0) {#if header}
    function create_if_block$8(ctx) {
    	let th;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			th = element("th");
    			if (default_slot) default_slot.c();
    			attr_dev(th, "align", /*align*/ ctx[1]);
    			add_location(th, file$j, 6, 2, 74);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);

    			if (default_slot) {
    				default_slot.m(th, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*align*/ 2) {
    				attr_dev(th, "align", /*align*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(6:0) {#if header}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$8, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*header*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableCell', slots, ['default']);
    	let { header } = $$props;
    	let { align } = $$props;
    	const writable_props = ['header', 'align'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TableCell> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('header' in $$props) $$invalidate(0, header = $$props.header);
    		if ('align' in $$props) $$invalidate(1, align = $$props.align);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ header, align });

    	$$self.$inject_state = $$props => {
    		if ('header' in $$props) $$invalidate(0, header = $$props.header);
    		if ('align' in $$props) $$invalidate(1, align = $$props.align);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [header, align, $$scope, slots];
    }

    class TableCell extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { header: 0, align: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableCell",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*header*/ ctx[0] === undefined && !('header' in props)) {
    			console.warn("<TableCell> was created without expected prop 'header'");
    		}

    		if (/*align*/ ctx[1] === undefined && !('align' in props)) {
    			console.warn("<TableCell> was created without expected prop 'align'");
    		}
    	}

    	get header() {
    		throw new Error("<TableCell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set header(value) {
    		throw new Error("<TableCell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<TableCell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<TableCell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/List.svelte generated by Svelte v3.48.0 */

    const file$i = "node_modules/svelte-markdown/src/renderers/List.svelte";

    // (8:0) {:else}
    function create_else_block$3(ctx) {
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			add_location(ul, file$i, 8, 2, 117);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(8:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (6:0) {#if ordered}
    function create_if_block$7(ctx) {
    	let ol;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			ol = element("ol");
    			if (default_slot) default_slot.c();
    			attr_dev(ol, "start", /*start*/ ctx[1]);
    			add_location(ol, file$i, 6, 2, 76);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ol, anchor);

    			if (default_slot) {
    				default_slot.m(ol, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*start*/ 2) {
    				attr_dev(ol, "start", /*start*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ol);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(6:0) {#if ordered}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$7, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*ordered*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('List', slots, ['default']);
    	let { ordered } = $$props;
    	let { start } = $$props;
    	const writable_props = ['ordered', 'start'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ordered' in $$props) $$invalidate(0, ordered = $$props.ordered);
    		if ('start' in $$props) $$invalidate(1, start = $$props.start);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ ordered, start });

    	$$self.$inject_state = $$props => {
    		if ('ordered' in $$props) $$invalidate(0, ordered = $$props.ordered);
    		if ('start' in $$props) $$invalidate(1, start = $$props.start);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ordered, start, $$scope, slots];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { ordered: 0, start: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$k.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*ordered*/ ctx[0] === undefined && !('ordered' in props)) {
    			console.warn("<List> was created without expected prop 'ordered'");
    		}

    		if (/*start*/ ctx[1] === undefined && !('start' in props)) {
    			console.warn("<List> was created without expected prop 'start'");
    		}
    	}

    	get ordered() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ordered(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get start() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set start(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/ListItem.svelte generated by Svelte v3.48.0 */

    const file$h = "node_modules/svelte-markdown/src/renderers/ListItem.svelte";

    function create_fragment$j(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			add_location(li, file$h, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListItem', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ListItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class ListItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListItem",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Hr.svelte generated by Svelte v3.48.0 */

    const file$g = "node_modules/svelte-markdown/src/renderers/Hr.svelte";

    function create_fragment$i(ctx) {
    	let hr;

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			add_location(hr, file$g, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hr', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hr> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Hr extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hr",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Html.svelte generated by Svelte v3.48.0 */

    function create_fragment$h(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*text*/ ctx[0], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) html_tag.p(/*text*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Html', slots, []);
    	let { text } = $$props;
    	const writable_props = ['text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Html> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ text });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text];
    }

    class Html extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Html",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<Html> was created without expected prop 'text'");
    		}
    	}

    	get text() {
    		throw new Error("<Html>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Html>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Blockquote.svelte generated by Svelte v3.48.0 */

    const file$f = "node_modules/svelte-markdown/src/renderers/Blockquote.svelte";

    function create_fragment$g(ctx) {
    	let blockquote;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			blockquote = element("blockquote");
    			if (default_slot) default_slot.c();
    			add_location(blockquote, file$f, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, blockquote, anchor);

    			if (default_slot) {
    				default_slot.m(blockquote, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(blockquote);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Blockquote', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Blockquote> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Blockquote extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blockquote",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Code.svelte generated by Svelte v3.48.0 */

    const file$e = "node_modules/svelte-markdown/src/renderers/Code.svelte";

    function create_fragment$f(ctx) {
    	let pre;
    	let code;
    	let t;

    	const block = {
    		c: function create() {
    			pre = element("pre");
    			code = element("code");
    			t = text(/*text*/ ctx[1]);
    			add_location(code, file$e, 5, 18, 74);
    			attr_dev(pre, "class", /*lang*/ ctx[0]);
    			add_location(pre, file$e, 5, 0, 56);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, pre, anchor);
    			append_dev(pre, code);
    			append_dev(code, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 2) set_data_dev(t, /*text*/ ctx[1]);

    			if (dirty & /*lang*/ 1) {
    				attr_dev(pre, "class", /*lang*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(pre);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Code', slots, []);
    	let { lang } = $$props;
    	let { text } = $$props;
    	const writable_props = ['lang', 'text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Code> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('lang' in $$props) $$invalidate(0, lang = $$props.lang);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ lang, text });

    	$$self.$inject_state = $$props => {
    		if ('lang' in $$props) $$invalidate(0, lang = $$props.lang);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [lang, text];
    }

    class Code extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { lang: 0, text: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Code",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*lang*/ ctx[0] === undefined && !('lang' in props)) {
    			console.warn("<Code> was created without expected prop 'lang'");
    		}

    		if (/*text*/ ctx[1] === undefined && !('text' in props)) {
    			console.warn("<Code> was created without expected prop 'text'");
    		}
    	}

    	get lang() {
    		throw new Error("<Code>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lang(value) {
    		throw new Error("<Code>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Code>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Code>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Br.svelte generated by Svelte v3.48.0 */

    const file$d = "node_modules/svelte-markdown/src/renderers/Br.svelte";

    function create_fragment$e(ctx) {
    	let br;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			br = element("br");
    			if (default_slot) default_slot.c();
    			add_location(br, file$d, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Br', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Br> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Br extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Br",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    const defaultRenderers = {
      heading: Heading,
      paragraph: Paragraph,
      text: Text,
      image: Image,
      link: Link,
      em: Em,
      strong: Strong,
      codespan: Codespan,
      del: Del,
      table: Table,
      tablehead: TableHead,
      tablebody: TableBody,
      tablerow: TableRow,
      tablecell: TableCell,
      list: List,
      orderedlistitem: null,
      unorderedlistitem: null,
      listitem: ListItem,
      hr: Hr,
      html: Html,
      blockquote: Blockquote,
      code: Code,
      br: Br,
    };
    const defaultOptions = {
      baseUrl: null,
      breaks: false,
      gfm: true,
      headerIds: true,
      headerPrefix: '',
      highlight: null,
      langPrefix: 'language-',
      mangle: true,
      pedantic: false,
      renderer: null,
      sanitize: false,
      sanitizer: null,
      silent: false,
      smartLists: false,
      smartypants: false,
      tokenizer: null,
      xhtml: false,
    };

    /* node_modules/svelte-markdown/src/SvelteMarkdown.svelte generated by Svelte v3.48.0 */

    function create_fragment$d(ctx) {
    	let parser;
    	let current;

    	parser = new Parser$1({
    			props: {
    				tokens: /*tokens*/ ctx[0],
    				renderers: /*combinedRenderers*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const parser_changes = {};
    			if (dirty & /*tokens*/ 1) parser_changes.tokens = /*tokens*/ ctx[0];
    			if (dirty & /*combinedRenderers*/ 2) parser_changes.renderers = /*combinedRenderers*/ ctx[1];
    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let slugger;
    	let combinedOptions;
    	let combinedRenderers;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SvelteMarkdown', slots, []);
    	let { source = '' } = $$props;
    	let { renderers = {} } = $$props;
    	let { options = {} } = $$props;
    	let { isInline = false } = $$props;
    	const dispatch = createEventDispatcher();
    	let tokens;
    	let lexer;
    	let mounted;

    	setContext(key, {
    		slug: val => slugger ? slugger.slug(val) : '',
    		getOptions: () => combinedOptions
    	});

    	onMount(() => {
    		$$invalidate(7, mounted = true);
    	});

    	const writable_props = ['source', 'renderers', 'options', 'isInline'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SvelteMarkdown> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('source' in $$props) $$invalidate(2, source = $$props.source);
    		if ('renderers' in $$props) $$invalidate(3, renderers = $$props.renderers);
    		if ('options' in $$props) $$invalidate(4, options = $$props.options);
    		if ('isInline' in $$props) $$invalidate(5, isInline = $$props.isInline);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		createEventDispatcher,
    		onMount,
    		Parser: Parser$1,
    		Lexer,
    		Slugger,
    		defaultOptions,
    		defaultRenderers,
    		key,
    		source,
    		renderers,
    		options,
    		isInline,
    		dispatch,
    		tokens,
    		lexer,
    		mounted,
    		combinedOptions,
    		slugger,
    		combinedRenderers
    	});

    	$$self.$inject_state = $$props => {
    		if ('source' in $$props) $$invalidate(2, source = $$props.source);
    		if ('renderers' in $$props) $$invalidate(3, renderers = $$props.renderers);
    		if ('options' in $$props) $$invalidate(4, options = $$props.options);
    		if ('isInline' in $$props) $$invalidate(5, isInline = $$props.isInline);
    		if ('tokens' in $$props) $$invalidate(0, tokens = $$props.tokens);
    		if ('lexer' in $$props) $$invalidate(6, lexer = $$props.lexer);
    		if ('mounted' in $$props) $$invalidate(7, mounted = $$props.mounted);
    		if ('combinedOptions' in $$props) $$invalidate(8, combinedOptions = $$props.combinedOptions);
    		if ('slugger' in $$props) slugger = $$props.slugger;
    		if ('combinedRenderers' in $$props) $$invalidate(1, combinedRenderers = $$props.combinedRenderers);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*source*/ 4) {
    			slugger = source ? new Slugger() : undefined;
    		}

    		if ($$self.$$.dirty & /*options*/ 16) {
    			$$invalidate(8, combinedOptions = { ...defaultOptions, ...options });
    		}

    		if ($$self.$$.dirty & /*combinedOptions, isInline, lexer, source, tokens*/ 357) {
    			{
    				$$invalidate(6, lexer = new Lexer(combinedOptions));

    				$$invalidate(0, tokens = isInline
    				? lexer.inlineTokens(source)
    				: lexer.lex(source));

    				dispatch('parsed', { tokens });
    			}
    		}

    		if ($$self.$$.dirty & /*renderers*/ 8) {
    			$$invalidate(1, combinedRenderers = { ...defaultRenderers, ...renderers });
    		}

    		if ($$self.$$.dirty & /*mounted, tokens*/ 129) {
    			mounted && dispatch('parsed', { tokens });
    		}
    	};

    	return [
    		tokens,
    		combinedRenderers,
    		source,
    		renderers,
    		options,
    		isInline,
    		lexer,
    		mounted,
    		combinedOptions
    	];
    }

    class SvelteMarkdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			source: 2,
    			renderers: 3,
    			options: 4,
    			isInline: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SvelteMarkdown",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get source() {
    		throw new Error("<SvelteMarkdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set source(value) {
    		throw new Error("<SvelteMarkdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderers() {
    		throw new Error("<SvelteMarkdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderers(value) {
    		throw new Error("<SvelteMarkdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<SvelteMarkdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<SvelteMarkdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isInline() {
    		throw new Error("<SvelteMarkdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isInline(value) {
    		throw new Error("<SvelteMarkdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/modals/modal.svelte generated by Svelte v3.48.0 */
    const file$c = "src/components/modals/modal.svelte";

    function create_fragment$c(ctx) {
    	let div1;
    	let div0;
    	let div0_intro;
    	let div0_outro;
    	let div1_transition;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			set_style(div0, "width", /*width*/ ctx[0]);
    			set_style(div0, "height", /*height*/ ctx[1]);
    			attr_dev(div0, "class", "pop-up-content svelte-1tydxdc");
    			add_location(div0, file$c, 9, 1, 313);
    			attr_dev(div1, "class", "pop-up svelte-1tydxdc");
    			add_location(div1, file$c, 8, 0, 177);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", stop_propagation(/*click_handler*/ ctx[5]), false, false, true),
    					listen_dev(div1, "click", /*click_handler_1*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*width*/ 1) {
    				set_style(div0, "width", /*width*/ ctx[0]);
    			}

    			if (!current || dirty & /*height*/ 2) {
    				set_style(div0, "height", /*height*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div0_outro) div0_outro.end(1);
    				div0_intro = create_in_transition(div0, fly, { y: 50 });
    				div0_intro.start();
    			});

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { duration: 200 }, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div0_intro) div0_intro.invalidate();
    			div0_outro = create_out_transition(div0, fly, { y: 50 });
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { duration: 200 }, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div0_outro) div0_outro.end();
    			if (detaching && div1_transition) div1_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $modalState;
    	validate_store(modalState, 'modalState');
    	component_subscribe($$self, modalState, $$value => $$invalidate(2, $modalState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	let { width = "80vw" } = $$props;
    	let { height = "90vh" } = $$props;
    	const writable_props = ['width', 'height'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler_1 = () => set_store_value(modalState, $modalState = { "modalType": null, "modalContent": null }, $modalState);

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		modalState,
    		fly,
    		fade,
    		width,
    		height,
    		$modalState
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, $modalState, $$scope, slots, click_handler, click_handler_1];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { width: 0, height: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get width() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/shared/interactiveListDropdown.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1$1 } = globals;
    const file$b = "src/components/shared/interactiveListDropdown.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (24:2) {:else}
    function create_else_block$2(ctx) {
    	let await_block_anchor;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 10,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*loading*/ ctx[4], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*loading*/ 16 && promise !== (promise = /*loading*/ ctx[4]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(24:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (18:2) {#if !loading}
    function create_if_block$6(ctx) {
    	let ul;
    	let each_value = Object.keys(/*listOptions*/ ctx[1]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-aibboq");
    			add_location(ul, file$b, 18, 3, 380);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*loading, processClick, Object, listOptions*/ 19) {
    				each_value = Object.keys(/*listOptions*/ ctx[1]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(18:2) {#if !loading}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>  export let processClick  export let listOptions  export let successMessage  export let iconName = "copy"   let loading = false   import Icon from "./icons.svelte"  import Loader from "./loader.svelte"  import Dropdown from "./dropdown.svelte" </script>  <button on:click|stopPropagation={() => loading = false}
    function create_catch_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script>  export let processClick  export let listOptions  export let successMessage  export let iconName = \\\"copy\\\"   let loading = false   import Icon from \\\"./icons.svelte\\\"  import Loader from \\\"./loader.svelte\\\"  import Dropdown from \\\"./dropdown.svelte\\\" </script>  <button on:click|stopPropagation={() => loading = false}",
    		ctx
    	});

    	return block;
    }

    // (27:3) {:then loadingResult}
    function create_then_block$1(ctx) {
    	let p;

    	let t_value = (/*loadingResult*/ ctx[10]
    	? /*successMessage*/ ctx[2]
    	: "Failed, try again") + "";

    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "svelte-aibboq");
    			add_location(p, file$b, 27, 4, 626);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*loading, successMessage*/ 20 && t_value !== (t_value = (/*loadingResult*/ ctx[10]
    			? /*successMessage*/ ctx[2]
    			: "Failed, try again") + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(27:3) {:then loadingResult}",
    		ctx
    	});

    	return block;
    }

    // (25:19)      <Loader height="3rem"/>    {:then loadingResult}
    function create_pending_block$1(ctx) {
    	let loader;
    	let current;

    	loader = new Loader({
    			props: { height: "3rem" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(25:19)      <Loader height=\\\"3rem\\\"/>    {:then loadingResult}",
    		ctx
    	});

    	return block;
    }

    // (20:3) {#each Object.keys(listOptions) as option}
    function create_each_block$3(ctx) {
    	let li;
    	let t_value = /*option*/ ctx[7] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*option*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "svelte-aibboq");
    			add_location(li, file$b, 20, 4, 435);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", stop_propagation(click_handler), false, false, true);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*listOptions*/ 2 && t_value !== (t_value = /*option*/ ctx[7] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(20:3) {#each Object.keys(listOptions) as option}",
    		ctx
    	});

    	return block;
    }

    // (17:1) <Dropdown>
    function create_default_slot$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*loading*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(17:1) <Dropdown>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let button;
    	let icon;
    	let t;
    	let dropdown;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icons({
    			props: { name: /*iconName*/ ctx[3] },
    			$$inline: true
    		});

    	dropdown = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			t = space();
    			create_component(dropdown.$$.fragment);
    			attr_dev(button, "class", "svelte-aibboq");
    			add_location(button, file$b, 13, 0, 264);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			append_dev(button, t);
    			mount_component(dropdown, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", stop_propagation(/*click_handler_1*/ ctx[6]), false, false, true);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const icon_changes = {};
    			if (dirty & /*iconName*/ 8) icon_changes.name = /*iconName*/ ctx[3];
    			icon.$set(icon_changes);
    			const dropdown_changes = {};

    			if (dirty & /*$$scope, listOptions, loading, processClick, successMessage*/ 2071) {
    				dropdown_changes.$$scope = { dirty, ctx };
    			}

    			dropdown.$set(dropdown_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(dropdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(dropdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    			destroy_component(dropdown);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InteractiveListDropdown', slots, []);
    	let { processClick } = $$props;
    	let { listOptions } = $$props;
    	let { successMessage } = $$props;
    	let { iconName = "copy" } = $$props;
    	let loading = false;
    	const writable_props = ['processClick', 'listOptions', 'successMessage', 'iconName'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InteractiveListDropdown> was created with unknown prop '${key}'`);
    	});

    	const click_handler = option => $$invalidate(4, loading = processClick(option));
    	const click_handler_1 = () => $$invalidate(4, loading = false);

    	$$self.$$set = $$props => {
    		if ('processClick' in $$props) $$invalidate(0, processClick = $$props.processClick);
    		if ('listOptions' in $$props) $$invalidate(1, listOptions = $$props.listOptions);
    		if ('successMessage' in $$props) $$invalidate(2, successMessage = $$props.successMessage);
    		if ('iconName' in $$props) $$invalidate(3, iconName = $$props.iconName);
    	};

    	$$self.$capture_state = () => ({
    		processClick,
    		listOptions,
    		successMessage,
    		iconName,
    		loading,
    		Icon: Icons,
    		Loader,
    		Dropdown
    	});

    	$$self.$inject_state = $$props => {
    		if ('processClick' in $$props) $$invalidate(0, processClick = $$props.processClick);
    		if ('listOptions' in $$props) $$invalidate(1, listOptions = $$props.listOptions);
    		if ('successMessage' in $$props) $$invalidate(2, successMessage = $$props.successMessage);
    		if ('iconName' in $$props) $$invalidate(3, iconName = $$props.iconName);
    		if ('loading' in $$props) $$invalidate(4, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		processClick,
    		listOptions,
    		successMessage,
    		iconName,
    		loading,
    		click_handler,
    		click_handler_1
    	];
    }

    class InteractiveListDropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			processClick: 0,
    			listOptions: 1,
    			successMessage: 2,
    			iconName: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InteractiveListDropdown",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*processClick*/ ctx[0] === undefined && !('processClick' in props)) {
    			console.warn("<InteractiveListDropdown> was created without expected prop 'processClick'");
    		}

    		if (/*listOptions*/ ctx[1] === undefined && !('listOptions' in props)) {
    			console.warn("<InteractiveListDropdown> was created without expected prop 'listOptions'");
    		}

    		if (/*successMessage*/ ctx[2] === undefined && !('successMessage' in props)) {
    			console.warn("<InteractiveListDropdown> was created without expected prop 'successMessage'");
    		}
    	}

    	get processClick() {
    		throw new Error("<InteractiveListDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set processClick(value) {
    		throw new Error("<InteractiveListDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listOptions() {
    		throw new Error("<InteractiveListDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listOptions(value) {
    		throw new Error("<InteractiveListDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get successMessage() {
    		throw new Error("<InteractiveListDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set successMessage(value) {
    		throw new Error("<InteractiveListDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconName() {
    		throw new Error("<InteractiveListDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconName(value) {
    		throw new Error("<InteractiveListDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/modals/article.svelte generated by Svelte v3.48.0 */
    const file$a = "src/components/modals/article.svelte";

    // (52:0) <Modal>
    function create_default_slot$4(ctx) {
    	let base;
    	let t0;
    	let header;
    	let nav;
    	let ul0;
    	let li0;
    	let readlaterbutton;
    	let t1;
    	let li1;
    	let addtocollectionbutton;
    	let t2;
    	let ul1;
    	let li2;
    	let generalinteractivelist0;
    	let t3;
    	let li3;
    	let generalinteractivelist1;
    	let t4;
    	let li4;
    	let a;
    	let icon;
    	let a_href_value;
    	let t5;
    	let div;
    	let h1;
    	let t6_value = /*articleObject*/ ctx[0].title + "";
    	let t6;
    	let t7;
    	let h4;
    	let t8;
    	let t9_value = /*articleObject*/ ctx[0].source + "";
    	let t9;
    	let t10;
    	let t11_value = /*articleObject*/ ctx[0].author + "";
    	let t11;
    	let t12;
    	let t13_value = /*articleObject*/ ctx[0].publish_date + "";
    	let t13;
    	let t14;
    	let t15_value = /*articleObject*/ ctx[0].read_times + "";
    	let t15;
    	let t16;
    	let t17;
    	let img;
    	let img_src_value;
    	let t18;
    	let h2;
    	let t19_value = /*articleObject*/ ctx[0].description + "";
    	let t19;
    	let t20;
    	let sveltemarkdown;
    	let t21;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	readlaterbutton = new ReadLater({
    			props: { ID: /*articleObject*/ ctx[0].id },
    			$$inline: true
    		});

    	addtocollectionbutton = new AddToCollection({
    			props: { ID: /*articleObject*/ ctx[0].id },
    			$$inline: true
    		});

    	generalinteractivelist0 = new InteractiveListDropdown({
    			props: {
    				processClick: /*func*/ ctx[5],
    				listOptions: /*shareLinks*/ ctx[2],
    				successMessage: "Shared to SoMe.",
    				iconName: "share"
    			},
    			$$inline: true
    		});

    	generalinteractivelist1 = new InteractiveListDropdown({
    			props: {
    				processClick: /*copyAttr*/ ctx[4],
    				listOptions: /*potentialCopyTargets*/ ctx[3],
    				successMessage: "Copied to clipboard."
    			},
    			$$inline: true
    		});

    	icon = new Icons({
    			props: { name: "download-file" },
    			$$inline: true
    		});

    	sveltemarkdown = new SvelteMarkdown({
    			props: { source: /*source*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			base = element("base");
    			t0 = space();
    			header = element("header");
    			nav = element("nav");
    			ul0 = element("ul");
    			li0 = element("li");
    			create_component(readlaterbutton.$$.fragment);
    			t1 = space();
    			li1 = element("li");
    			create_component(addtocollectionbutton.$$.fragment);
    			t2 = space();
    			ul1 = element("ul");
    			li2 = element("li");
    			create_component(generalinteractivelist0.$$.fragment);
    			t3 = space();
    			li3 = element("li");
    			create_component(generalinteractivelist1.$$.fragment);
    			t4 = space();
    			li4 = element("li");
    			a = element("a");
    			create_component(icon.$$.fragment);
    			t5 = space();
    			div = element("div");
    			h1 = element("h1");
    			t6 = text(t6_value);
    			t7 = space();
    			h4 = element("h4");
    			t8 = text("From ");
    			t9 = text(t9_value);
    			t10 = text(" - Written by ");
    			t11 = text(t11_value);
    			t12 = text(" - ");
    			t13 = text(t13_value);
    			t14 = text(" - Read ");
    			t15 = text(t15_value);
    			t16 = text(" times.");
    			t17 = space();
    			img = element("img");
    			t18 = space();
    			h2 = element("h2");
    			t19 = text(t19_value);
    			t20 = space();
    			create_component(sveltemarkdown.$$.fragment);
    			t21 = space();
    			button = element("button");
    			button.textContent = "Read article on website";
    			attr_dev(base, "target", "_blank");
    			add_location(base, file$a, 52, 1, 1553);
    			attr_dev(li0, "class", "svelte-1xly5if");
    			add_location(li0, file$a, 56, 4, 1606);
    			attr_dev(li1, "class", "svelte-1xly5if");
    			add_location(li1, file$a, 57, 4, 1663);
    			attr_dev(ul0, "class", "svelte-1xly5if");
    			add_location(ul0, file$a, 55, 3, 1597);
    			attr_dev(li2, "class", "svelte-1xly5if");
    			add_location(li2, file$a, 60, 4, 1742);
    			attr_dev(li3, "class", "svelte-1xly5if");
    			add_location(li3, file$a, 61, 4, 1930);
    			attr_dev(a, "href", a_href_value = `${appConfig.rootUrl}/articles/MD/single?ID=${/*articleObject*/ ctx[0].id}`);
    			attr_dev(a, "class", "svelte-1xly5if");
    			add_location(a, file$a, 62, 8, 2073);
    			attr_dev(li4, "class", "svelte-1xly5if");
    			add_location(li4, file$a, 62, 4, 2069);
    			attr_dev(ul1, "class", "svelte-1xly5if");
    			add_location(ul1, file$a, 59, 3, 1733);
    			attr_dev(nav, "class", "svelte-1xly5if");
    			add_location(nav, file$a, 54, 2, 1588);
    			attr_dev(header, "class", "svelte-1xly5if");
    			add_location(header, file$a, 53, 1, 1577);
    			add_location(h1, file$a, 68, 2, 2249);
    			add_location(h4, file$a, 69, 2, 2284);
    			attr_dev(img, "alt", "Main Article");
    			if (!src_url_equal(img.src, img_src_value = /*articleObject*/ ctx[0].image_url)) attr_dev(img, "src", img_src_value);
    			add_location(img, file$a, 70, 2, 2436);
    			add_location(h2, file$a, 71, 2, 2497);
    			attr_dev(button, "class", "svelte-1xly5if");
    			add_location(button, file$a, 73, 2, 2568);
    			attr_dev(div, "class", "article-content svelte-1xly5if");
    			add_location(div, file$a, 67, 1, 2217);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, base, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, header, anchor);
    			append_dev(header, nav);
    			append_dev(nav, ul0);
    			append_dev(ul0, li0);
    			mount_component(readlaterbutton, li0, null);
    			append_dev(ul0, t1);
    			append_dev(ul0, li1);
    			mount_component(addtocollectionbutton, li1, null);
    			append_dev(nav, t2);
    			append_dev(nav, ul1);
    			append_dev(ul1, li2);
    			mount_component(generalinteractivelist0, li2, null);
    			append_dev(ul1, t3);
    			append_dev(ul1, li3);
    			mount_component(generalinteractivelist1, li3, null);
    			append_dev(ul1, t4);
    			append_dev(ul1, li4);
    			append_dev(li4, a);
    			mount_component(icon, a, null);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t6);
    			append_dev(div, t7);
    			append_dev(div, h4);
    			append_dev(h4, t8);
    			append_dev(h4, t9);
    			append_dev(h4, t10);
    			append_dev(h4, t11);
    			append_dev(h4, t12);
    			append_dev(h4, t13);
    			append_dev(h4, t14);
    			append_dev(h4, t15);
    			append_dev(h4, t16);
    			append_dev(div, t17);
    			append_dev(div, img);
    			append_dev(div, t18);
    			append_dev(div, h2);
    			append_dev(h2, t19);
    			append_dev(div, t20);
    			mount_component(sveltemarkdown, div, null);
    			append_dev(div, t21);
    			append_dev(div, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const readlaterbutton_changes = {};
    			if (dirty & /*articleObject*/ 1) readlaterbutton_changes.ID = /*articleObject*/ ctx[0].id;
    			readlaterbutton.$set(readlaterbutton_changes);
    			const addtocollectionbutton_changes = {};
    			if (dirty & /*articleObject*/ 1) addtocollectionbutton_changes.ID = /*articleObject*/ ctx[0].id;
    			addtocollectionbutton.$set(addtocollectionbutton_changes);

    			if (!current || dirty & /*articleObject*/ 1 && a_href_value !== (a_href_value = `${appConfig.rootUrl}/articles/MD/single?ID=${/*articleObject*/ ctx[0].id}`)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty & /*articleObject*/ 1) && t6_value !== (t6_value = /*articleObject*/ ctx[0].title + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*articleObject*/ 1) && t9_value !== (t9_value = /*articleObject*/ ctx[0].source + "")) set_data_dev(t9, t9_value);
    			if ((!current || dirty & /*articleObject*/ 1) && t11_value !== (t11_value = /*articleObject*/ ctx[0].author + "")) set_data_dev(t11, t11_value);
    			if ((!current || dirty & /*articleObject*/ 1) && t13_value !== (t13_value = /*articleObject*/ ctx[0].publish_date + "")) set_data_dev(t13, t13_value);
    			if ((!current || dirty & /*articleObject*/ 1) && t15_value !== (t15_value = /*articleObject*/ ctx[0].read_times + "")) set_data_dev(t15, t15_value);

    			if (!current || dirty & /*articleObject*/ 1 && !src_url_equal(img.src, img_src_value = /*articleObject*/ ctx[0].image_url)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty & /*articleObject*/ 1) && t19_value !== (t19_value = /*articleObject*/ ctx[0].description + "")) set_data_dev(t19, t19_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(readlaterbutton.$$.fragment, local);
    			transition_in(addtocollectionbutton.$$.fragment, local);
    			transition_in(generalinteractivelist0.$$.fragment, local);
    			transition_in(generalinteractivelist1.$$.fragment, local);
    			transition_in(icon.$$.fragment, local);
    			transition_in(sveltemarkdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(readlaterbutton.$$.fragment, local);
    			transition_out(addtocollectionbutton.$$.fragment, local);
    			transition_out(generalinteractivelist0.$$.fragment, local);
    			transition_out(generalinteractivelist1.$$.fragment, local);
    			transition_out(icon.$$.fragment, local);
    			transition_out(sveltemarkdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(base);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(header);
    			destroy_component(readlaterbutton);
    			destroy_component(addtocollectionbutton);
    			destroy_component(generalinteractivelist0);
    			destroy_component(generalinteractivelist1);
    			destroy_component(icon);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div);
    			destroy_component(sveltemarkdown);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(52:0) <Modal>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, articleObject*/ 129) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Article', slots, []);
    	let { articleObject } = $$props;
    	const source = articleObject.formatted_content;

    	// https://github.com/bradvin/social-share-urls
    	const shareLinks = {
    		"LinkedIn": `https://www.linkedin.com/sharing/share-offsite/?url=${articleObject.url}`,
    		"Twitter": `https://twitter.com/intent/tweet?url=${articleObject.url}&text=${articleObject.title}`,
    		"Reddit": `https://reddit.com/submit?url=${articleObject.url}&title=${articleObject.title}`
    	};

    	let potentialCopyTargets = {
    		"Url": async () => articleObject.url,
    		"Raw Content": async () => articleObject.content,
    		"MD Content": async () => articleObject.formatted_content,
    		"Whole Article": async () => {
    			let wholeArticle = await fetch(`/articles/MD/single?ID=${encodeURIComponent(articleObject.id)}`);

    			if (wholeArticle.ok) {
    				return await wholeArticle.text();
    			} else {
    				return false;
    			}
    		}
    	};

    	async function copyAttr(copyTarget) {
    		if (copyTarget in potentialCopyTargets) {
    			let copyContent = await potentialCopyTargets[copyTarget]();

    			if (Boolean(copyContent)) {
    				navigator.clipboard.writeText(copyContent);
    				return true;
    			}
    		}

    		return false;
    	}

    	const writable_props = ['articleObject'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Article> was created with unknown prop '${key}'`);
    	});

    	const func = target => window.open(shareLinks[target], "_blank");
    	const click_handler = () => window.open(articleObject.url, "_blank");

    	$$self.$$set = $$props => {
    		if ('articleObject' in $$props) $$invalidate(0, articleObject = $$props.articleObject);
    	};

    	$$self.$capture_state = () => ({
    		appConfig,
    		SvelteMarkdown,
    		Modal,
    		Icon: Icons,
    		ReadLaterButton: ReadLater,
    		AddToCollectionButton: AddToCollection,
    		GeneralInteractiveList: InteractiveListDropdown,
    		articleObject,
    		source,
    		shareLinks,
    		potentialCopyTargets,
    		copyAttr
    	});

    	$$self.$inject_state = $$props => {
    		if ('articleObject' in $$props) $$invalidate(0, articleObject = $$props.articleObject);
    		if ('potentialCopyTargets' in $$props) $$invalidate(3, potentialCopyTargets = $$props.potentialCopyTargets);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		articleObject,
    		source,
    		shareLinks,
    		potentialCopyTargets,
    		copyAttr,
    		func,
    		click_handler
    	];
    }

    class Article extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { articleObject: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Article",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*articleObject*/ ctx[0] === undefined && !('articleObject' in props)) {
    			console.warn("<Article> was created without expected prop 'articleObject'");
    		}
    	}

    	get articleObject() {
    		throw new Error("<Article>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set articleObject(value) {
    		throw new Error("<Article>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/modals/search/sourceSelect.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1 } = globals;
    const file$9 = "src/components/modals/search/sourceSelect.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i][0];
    	child_ctx[13] = list[i][1];
    	return child_ctx;
    }

    // (13:2) {#if sourceSearch}
    function create_if_block_2$2(ctx) {
    	let button;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;
    	icon = new Icons({ props: { name: "x" }, $$inline: true });

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			attr_dev(button, "class", "svelte-ffp58u");
    			add_location(button, file$9, 12, 20, 416);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", prevent_default(/*click_handler*/ ctx[7]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(13:2) {#if sourceSearch}",
    		ctx
    	});

    	return block;
    }

    // (23:1) {#if sourceSearch.length == 0 || sourceDetails.name.toLowerCase().includes(sourceSearch)}
    function create_if_block$5(ctx) {
    	let label;
    	let img;
    	let img_alt_value;
    	let img_src_value;
    	let t0;
    	let div0;
    	let h3;
    	let t1_value = /*sourceDetails*/ ctx[13].name + "";
    	let t1;
    	let t2;
    	let a;
    	let t3_value = /*sourceDetails*/ ctx[13].url.replace("https://", "") + "";
    	let t3;
    	let a_href_value;
    	let t4;
    	let div1;
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let t5;
    	let label_for_value;
    	let current;
    	const if_block_creators = [create_if_block_1$3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*$searchSpecs, sourceList*/ 10) show_if = null;
    		if (show_if == null) show_if = !!("sourceCategory" in /*$searchSpecs*/ ctx[3] && /*$searchSpecs*/ ctx[3].sourceCategory.indexOf(/*profileName*/ ctx[12]) > -1);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, -1);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			h3 = element("h3");
    			t1 = text(t1_value);
    			t2 = space();
    			a = element("a");
    			t3 = text(t3_value);
    			t4 = space();
    			div1 = element("div");
    			if_block.c();
    			t5 = space();
    			attr_dev(img, "alt", img_alt_value = "" + (/*sourceDetails*/ ctx[13].name + " icon"));
    			if (!src_url_equal(img.src, img_src_value = /*sourceDetails*/ ctx[13].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-ffp58u");
    			add_location(img, file$9, 24, 2, 1268);
    			attr_dev(h3, "class", "svelte-ffp58u");
    			add_location(h3, file$9, 26, 3, 1369);
    			attr_dev(a, "href", a_href_value = /*sourceDetails*/ ctx[13].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			attr_dev(a, "class", "svelte-ffp58u");
    			add_location(a, file$9, 27, 3, 1404);
    			attr_dev(div0, "class", "sourceDetails svelte-ffp58u");
    			add_location(div0, file$9, 25, 2, 1338);
    			attr_dev(div1, "class", "selectIcon svelte-ffp58u");
    			add_location(div1, file$9, 30, 2, 1540);
    			attr_dev(label, "for", label_for_value = "" + (/*profileName*/ ctx[12] + "-checkbox"));
    			attr_dev(label, "class", "svelte-ffp58u");
    			add_location(label, file$9, 23, 1, 1229);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, img);
    			append_dev(label, t0);
    			append_dev(label, div0);
    			append_dev(div0, h3);
    			append_dev(h3, t1);
    			append_dev(div0, t2);
    			append_dev(div0, a);
    			append_dev(a, t3);
    			append_dev(label, t4);
    			append_dev(label, div1);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(label, t5);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*sourceList*/ 2 && img_alt_value !== (img_alt_value = "" + (/*sourceDetails*/ ctx[13].name + " icon"))) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (!current || dirty & /*sourceList*/ 2 && !src_url_equal(img.src, img_src_value = /*sourceDetails*/ ctx[13].image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty & /*sourceList*/ 2) && t1_value !== (t1_value = /*sourceDetails*/ ctx[13].name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*sourceList*/ 2) && t3_value !== (t3_value = /*sourceDetails*/ ctx[13].url.replace("https://", "") + "")) set_data_dev(t3, t3_value);

    			if (!current || dirty & /*sourceList*/ 2 && a_href_value !== (a_href_value = /*sourceDetails*/ ctx[13].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}

    			if (!current || dirty & /*sourceList*/ 2 && label_for_value !== (label_for_value = "" + (/*profileName*/ ctx[12] + "-checkbox"))) {
    				attr_dev(label, "for", label_for_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(23:1) {#if sourceSearch.length == 0 || sourceDetails.name.toLowerCase().includes(sourceSearch)}",
    		ctx
    	});

    	return block;
    }

    // (34:3) {:else}
    function create_else_block$1(ctx) {
    	let icon;
    	let current;
    	icon = new Icons({ props: { name: "plus" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(34:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:3) {#if "sourceCategory" in $searchSpecs && $searchSpecs.sourceCategory.indexOf(profileName) > -1}
    function create_if_block_1$3(ctx) {
    	let icon;
    	let current;
    	icon = new Icons({ props: { name: "tick" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(32:3) {#if \\\"sourceCategory\\\" in $searchSpecs && $searchSpecs.sourceCategory.indexOf(profileName) > -1}",
    		ctx
    	});

    	return block;
    }

    // (20:0) {#each Object.entries(sourceList) as [profileName, sourceDetails]}
    function create_each_block$2(ctx) {
    	let input;
    	let input_id_value;
    	let input_name_value;
    	let input_value_value;
    	let t;
    	let show_if = /*sourceSearch*/ ctx[2].length == 0 || /*sourceDetails*/ ctx[13].name.toLowerCase().includes(/*sourceSearch*/ ctx[2]);
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = show_if && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			input = element("input");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", input_id_value = "" + (/*profileName*/ ctx[12] + "-checkbox"));
    			attr_dev(input, "name", input_name_value = /*profileName*/ ctx[12]);
    			input.__value = input_value_value = /*profileName*/ ctx[12];
    			input.value = input.__value;
    			attr_dev(input, "class", "svelte-ffp58u");
    			/*$$binding_groups*/ ctx[11][0].push(input);
    			add_location(input, file$9, 20, 1, 1000);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.checked = ~/*$searchSpecs*/ ctx[3].sourceCategory.indexOf(input.__value);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[10]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*sourceList*/ 2 && input_id_value !== (input_id_value = "" + (/*profileName*/ ctx[12] + "-checkbox"))) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (!current || dirty & /*sourceList*/ 2 && input_name_value !== (input_name_value = /*profileName*/ ctx[12])) {
    				attr_dev(input, "name", input_name_value);
    			}

    			if (!current || dirty & /*sourceList*/ 2 && input_value_value !== (input_value_value = /*profileName*/ ctx[12])) {
    				prop_dev(input, "__value", input_value_value);
    				input.value = input.__value;
    			}

    			if (dirty & /*$searchSpecs*/ 8) {
    				input.checked = ~/*$searchSpecs*/ ctx[3].sourceCategory.indexOf(input.__value);
    			}

    			if (dirty & /*sourceSearch, sourceList*/ 6) show_if = /*sourceSearch*/ ctx[2].length == 0 || /*sourceDetails*/ ctx[13].name.toLowerCase().includes(/*sourceSearch*/ ctx[2]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*sourceSearch, sourceList*/ 6) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*$$binding_groups*/ ctx[11][0].splice(/*$$binding_groups*/ ctx[11][0].indexOf(input), 1);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(20:0) {#each Object.entries(sourceList) as [profileName, sourceDetails]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let header;
    	let form0;
    	let label;
    	let icon;
    	let t0;
    	let input;
    	let t1;
    	let t2;
    	let p0;
    	let t3;
    	let t4_value = /*$searchSpecs*/ ctx[3].sourceCategory.length + "";
    	let t4;
    	let t5;
    	let t6;
    	let p1;
    	let t8;
    	let form1;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icons({
    			props: { name: "magnifying-glass" },
    			$$inline: true
    		});

    	let if_block = /*sourceSearch*/ ctx[2] && create_if_block_2$2(ctx);
    	let each_value = Object.entries(/*sourceList*/ ctx[1]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			header = element("header");
    			form0 = element("form");
    			label = element("label");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			input = element("input");
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			p0 = element("p");
    			t3 = text("Remove selections (");
    			t4 = text(t4_value);
    			t5 = text(")");
    			t6 = space();
    			p1 = element("p");
    			p1.textContent = "Select all";
    			t8 = space();
    			form1 = element("form");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(label, "for", "source-search");
    			attr_dev(label, "class", "svelte-ffp58u");
    			add_location(label, file$9, 10, 2, 230);
    			attr_dev(input, "id", "source-search");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search sources...");
    			attr_dev(input, "class", "svelte-ffp58u");
    			add_location(input, file$9, 11, 2, 299);
    			attr_dev(form0, "role", "search");
    			attr_dev(form0, "id", "source-search");
    			attr_dev(form0, "class", "svelte-ffp58u");
    			add_location(form0, file$9, 9, 1, 163);
    			attr_dev(p0, "class", "svelte-ffp58u");
    			toggle_class(p0, "clickable", /*$searchSpecs*/ ctx[3].sourceCategory.length > 0);
    			add_location(p0, file$9, 14, 1, 515);
    			attr_dev(p1, "class", "svelte-ffp58u");
    			toggle_class(p1, "clickable", Object.keys(/*sourceList*/ ctx[1]).length != /*$searchSpecs*/ ctx[3].sourceCategory.length);
    			add_location(p1, file$9, 15, 1, 689);
    			attr_dev(header, "class", "options svelte-ffp58u");
    			add_location(header, file$9, 8, 0, 137);
    			attr_dev(form1, "class", "source-select svelte-ffp58u");
    			add_location(form1, file$9, 18, 0, 878);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, form0);
    			append_dev(form0, label);
    			mount_component(icon, label, null);
    			append_dev(form0, t0);
    			append_dev(form0, input);
    			set_input_value(input, /*sourceSearch*/ ctx[2]);
    			append_dev(form0, t1);
    			if (if_block) if_block.m(form0, null);
    			append_dev(header, t2);
    			append_dev(header, p0);
    			append_dev(p0, t3);
    			append_dev(p0, t4);
    			append_dev(p0, t5);
    			append_dev(header, t6);
    			append_dev(header, p1);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, form1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(form1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[6]),
    					listen_dev(form0, "submit", prevent_default(/*submit_handler*/ ctx[5]), false, true, false),
    					listen_dev(p0, "click", /*click_handler_1*/ ctx[8], false, false, false),
    					listen_dev(p1, "click", /*click_handler_2*/ ctx[9], false, false, false),
    					listen_dev(form1, "submit", prevent_default(/*submit_handler_1*/ ctx[4]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*sourceSearch*/ 4 && input.value !== /*sourceSearch*/ ctx[2]) {
    				set_input_value(input, /*sourceSearch*/ ctx[2]);
    			}

    			if (/*sourceSearch*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*sourceSearch*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(form0, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty & /*$searchSpecs*/ 8) && t4_value !== (t4_value = /*$searchSpecs*/ ctx[3].sourceCategory.length + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*$searchSpecs*/ 8) {
    				toggle_class(p0, "clickable", /*$searchSpecs*/ ctx[3].sourceCategory.length > 0);
    			}

    			if (dirty & /*Object, sourceList, $searchSpecs*/ 10) {
    				toggle_class(p1, "clickable", Object.keys(/*sourceList*/ ctx[1]).length != /*$searchSpecs*/ ctx[3].sourceCategory.length);
    			}

    			if (dirty & /*Object, sourceList, $searchSpecs, sourceSearch*/ 14) {
    				each_value = Object.entries(/*sourceList*/ ctx[1]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(form1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(if_block);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(if_block);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(icon);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(form1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $searchSpecs,
    		$$unsubscribe_searchSpecs = noop,
    		$$subscribe_searchSpecs = () => ($$unsubscribe_searchSpecs(), $$unsubscribe_searchSpecs = subscribe(searchSpecs, $$value => $$invalidate(3, $searchSpecs = $$value)), searchSpecs);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_searchSpecs());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SourceSelect', slots, []);
    	let { searchSpecs } = $$props;
    	validate_store(searchSpecs, 'searchSpecs');
    	$$subscribe_searchSpecs();
    	let { sourceList } = $$props;
    	let sourceSearch = "";
    	const writable_props = ['searchSpecs', 'sourceList'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SourceSelect> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function submit_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function submit_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_input_handler() {
    		sourceSearch = this.value;
    		$$invalidate(2, sourceSearch);
    	}

    	const click_handler = () => $$invalidate(2, sourceSearch = "");
    	const click_handler_1 = () => set_store_value(searchSpecs, $searchSpecs.sourceCategory = [], $searchSpecs);
    	const click_handler_2 = () => set_store_value(searchSpecs, $searchSpecs.sourceCategory = Object.keys(sourceList), $searchSpecs);

    	function input_change_handler() {
    		$searchSpecs.sourceCategory = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		searchSpecs.set($searchSpecs);
    	}

    	$$self.$$set = $$props => {
    		if ('searchSpecs' in $$props) $$subscribe_searchSpecs($$invalidate(0, searchSpecs = $$props.searchSpecs));
    		if ('sourceList' in $$props) $$invalidate(1, sourceList = $$props.sourceList);
    	};

    	$$self.$capture_state = () => ({
    		Icon: Icons,
    		searchSpecs,
    		sourceList,
    		sourceSearch,
    		$searchSpecs
    	});

    	$$self.$inject_state = $$props => {
    		if ('searchSpecs' in $$props) $$subscribe_searchSpecs($$invalidate(0, searchSpecs = $$props.searchSpecs));
    		if ('sourceList' in $$props) $$invalidate(1, sourceList = $$props.sourceList);
    		if ('sourceSearch' in $$props) $$invalidate(2, sourceSearch = $$props.sourceSearch);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		searchSpecs,
    		sourceList,
    		sourceSearch,
    		$searchSpecs,
    		submit_handler_1,
    		submit_handler,
    		input_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		input_change_handler,
    		$$binding_groups
    	];
    }

    class SourceSelect extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { searchSpecs: 0, sourceList: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SourceSelect",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*searchSpecs*/ ctx[0] === undefined && !('searchSpecs' in props)) {
    			console.warn("<SourceSelect> was created without expected prop 'searchSpecs'");
    		}

    		if (/*sourceList*/ ctx[1] === undefined && !('sourceList' in props)) {
    			console.warn("<SourceSelect> was created without expected prop 'sourceList'");
    		}
    	}

    	get searchSpecs() {
    		throw new Error("<SourceSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchSpecs(value) {
    		throw new Error("<SourceSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sourceList() {
    		throw new Error("<SourceSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sourceList(value) {
    		throw new Error("<SourceSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/modals/search/general.svelte generated by Svelte v3.48.0 */

    const file$8 = "src/components/modals/search/general.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let h2;
    	let t0;
    	let t1;
    	let hr;
    	let t2;
    	let form;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text(/*inputTitle*/ ctx[0]);
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			form = element("form");
    			if (default_slot) default_slot.c();
    			attr_dev(h2, "class", "svelte-1pa2zxd");
    			add_location(h2, file$8, 6, 1, 95);
    			attr_dev(hr, "class", "svelte-1pa2zxd");
    			add_location(hr, file$8, 7, 1, 118);
    			attr_dev(form, "class", "svelte-1pa2zxd");
    			add_location(form, file$8, 8, 1, 124);
    			attr_dev(div, "class", "paramContainer svelte-1pa2zxd");
    			add_location(div, file$8, 5, 0, 65);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(div, t1);
    			append_dev(div, hr);
    			append_dev(div, t2);
    			append_dev(div, form);

    			if (default_slot) {
    				default_slot.m(form, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[4]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*inputTitle*/ 1) set_data_dev(t0, /*inputTitle*/ ctx[0]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('General', slots, ['default']);
    	let { inputTitle } = $$props;
    	let { inputDesc } = $$props;
    	const writable_props = ['inputTitle', 'inputDesc'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<General> was created with unknown prop '${key}'`);
    	});

    	function submit_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('inputTitle' in $$props) $$invalidate(0, inputTitle = $$props.inputTitle);
    		if ('inputDesc' in $$props) $$invalidate(1, inputDesc = $$props.inputDesc);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ inputTitle, inputDesc });

    	$$self.$inject_state = $$props => {
    		if ('inputTitle' in $$props) $$invalidate(0, inputTitle = $$props.inputTitle);
    		if ('inputDesc' in $$props) $$invalidate(1, inputDesc = $$props.inputDesc);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [inputTitle, inputDesc, $$scope, slots, submit_handler];
    }

    class General$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { inputTitle: 0, inputDesc: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "General",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*inputTitle*/ ctx[0] === undefined && !('inputTitle' in props)) {
    			console.warn("<General> was created without expected prop 'inputTitle'");
    		}

    		if (/*inputDesc*/ ctx[1] === undefined && !('inputDesc' in props)) {
    			console.warn("<General> was created without expected prop 'inputDesc'");
    		}
    	}

    	get inputTitle() {
    		throw new Error("<General>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputTitle(value) {
    		throw new Error("<General>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputDesc() {
    		throw new Error("<General>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputDesc(value) {
    		throw new Error("<General>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/modals/search/searchQuery.svelte generated by Svelte v3.48.0 */
    const file$7 = "src/components/modals/search/searchQuery.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[8] = list;
    	child_ctx[9] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i][0];
    	child_ctx[11] = list[i][1];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[14] = list;
    	child_ctx[15] = i;
    	return child_ctx;
    }

    // (37:1) {#each inputFields.timespan as inputDesc}
    function create_each_block_2(ctx) {
    	let div;
    	let input;
    	let t0;
    	let label;
    	let t1_value = /*inputDesc*/ ctx[7].readable + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[3].call(input, /*inputDesc*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(input, "id", /*inputDesc*/ ctx[7].name);
    			attr_dev(input, "name", /*inputDesc*/ ctx[7].name);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", " ");
    			attr_dev(input, "onfocus", "(this.type='date')");
    			attr_dev(input, "onblur", "(this.type='text')");
    			attr_dev(input, "class", "svelte-85pl2h");
    			add_location(input, file$7, 38, 3, 885);
    			attr_dev(label, "class", "desc svelte-85pl2h");
    			attr_dev(label, "for", /*inputDesc*/ ctx[7].name);
    			add_location(label, file$7, 39, 3, 1069);
    			attr_dev(div, "class", "input svelte-85pl2h");
    			add_location(div, file$7, 37, 2, 862);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*$searchSpecs*/ ctx[1][/*inputDesc*/ ctx[7].name]);
    			append_dev(div, t0);
    			append_dev(div, label);
    			append_dev(label, t1);
    			append_dev(div, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_input_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$searchSpecs, inputFields*/ 6 && input.value !== /*$searchSpecs*/ ctx[1][/*inputDesc*/ ctx[7].name]) {
    				set_input_value(input, /*$searchSpecs*/ ctx[1][/*inputDesc*/ ctx[7].name]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(37:1) {#each inputFields.timespan as inputDesc}",
    		ctx
    	});

    	return block;
    }

    // (36:0) <Params inputTitle="Timespan" inputDesc="Enter wanted date interval. Only articles published within this interval will be shown.">
    function create_default_slot_3(ctx) {
    	let each_1_anchor;
    	let each_value_2 = /*inputFields*/ ctx[2].timespan;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputFields, $searchSpecs*/ 6) {
    				each_value_2 = /*inputFields*/ ctx[2].timespan;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(36:0) <Params inputTitle=\\\"Timespan\\\" inputDesc=\\\"Enter wanted date interval. Only articles published within this interval will be shown.\\\">",
    		ctx
    	});

    	return block;
    }

    // (50:4) {#each inputDesc.options as [ value, name ] }
    function create_each_block_1$1(ctx) {
    	let option;
    	let t_value = /*name*/ ctx[11] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*value*/ ctx[10];
    			option.value = option.__value;
    			add_location(option, file$7, 50, 5, 1603);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(50:4) {#each inputDesc.options as [ value, name ] }",
    		ctx
    	});

    	return block;
    }

    // (46:1) {#each inputFields.sorting as inputDesc}
    function create_each_block$1(ctx) {
    	let div;
    	let select;
    	let option;
    	let t0_value = /*inputDesc*/ ctx[7].readable + "";
    	let t0;
    	let t1;
    	let label;
    	let t2_value = /*inputDesc*/ ctx[7].readable + "";
    	let t2;
    	let t3;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*inputDesc*/ ctx[7].options;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	function select_change_handler() {
    		/*select_change_handler*/ ctx[4].call(select, /*inputDesc*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			select = element("select");
    			option = element("option");
    			t0 = text(t0_value);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			label = element("label");
    			t2 = text(t2_value);
    			t3 = space();
    			option.__value = "";
    			option.value = option.__value;
    			option.disabled = true;
    			option.selected = true;
    			add_location(option, file$7, 48, 4, 1483);
    			attr_dev(select, "id", /*inputDesc*/ ctx[7].name);
    			attr_dev(select, "name", /*inputDesc*/ ctx[7].name);
    			attr_dev(select, "placeholder", " ");
    			attr_dev(select, "class", "svelte-85pl2h");
    			if (/*$searchSpecs*/ ctx[1][/*inputDesc*/ ctx[7].name] === void 0) add_render_callback(select_change_handler);
    			add_location(select, file$7, 47, 3, 1366);
    			attr_dev(label, "class", "desc svelte-85pl2h");
    			attr_dev(label, "for", /*inputDesc*/ ctx[7].name);
    			add_location(label, file$7, 53, 3, 1671);
    			attr_dev(div, "class", "input svelte-85pl2h");
    			add_location(div, file$7, 46, 2, 1343);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, select);
    			append_dev(select, option);
    			append_dev(option, t0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*$searchSpecs*/ ctx[1][/*inputDesc*/ ctx[7].name]);
    			append_dev(div, t1);
    			append_dev(div, label);
    			append_dev(label, t2);
    			append_dev(div, t3);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", select_change_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*inputFields*/ 4) {
    				each_value_1 = /*inputDesc*/ ctx[7].options;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*$searchSpecs, inputFields*/ 6) {
    				select_option(select, /*$searchSpecs*/ ctx[1][/*inputDesc*/ ctx[7].name]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(46:1) {#each inputFields.sorting as inputDesc}",
    		ctx
    	});

    	return block;
    }

    // (45:0) <Params inputTitle="Sorting" inputDesc="Choose how to sort articles and whether they should be sorted ascending or descending.">
    function create_default_slot_2$1(ctx) {
    	let each_1_anchor;
    	let each_value = /*inputFields*/ ctx[2].sorting;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputFields, $searchSpecs*/ 6) {
    				each_value = /*inputFields*/ ctx[2].sorting;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(45:0) <Params inputTitle=\\\"Sorting\\\" inputDesc=\\\"Choose how to sort articles and whether they should be sorted ascending or descending.\\\">",
    		ctx
    	});

    	return block;
    }

    // (59:0) <Params inputTitle="Limit" inputDesc="Limit number of articles queried from server. Higher number will lead to increased server-load.">
    function create_default_slot_1$1(ctx) {
    	let div;
    	let input;
    	let t0;
    	let label;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			label.textContent = "Limit";
    			attr_dev(input, "id", "limit-input");
    			attr_dev(input, "name", "limit-input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", "1");
    			attr_dev(input, "max", "1000");
    			attr_dev(input, "placeholder", " ");
    			attr_dev(input, "class", "svelte-85pl2h");
    			add_location(input, file$7, 60, 2, 1931);
    			attr_dev(label, "for", "limit-input");
    			attr_dev(label, "class", "desc svelte-85pl2h");
    			add_location(label, file$7, 61, 2, 2061);
    			attr_dev(div, "class", "input svelte-85pl2h");
    			add_location(div, file$7, 59, 1, 1909);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*$searchSpecs*/ ctx[1]["limit"]);
    			append_dev(div, t0);
    			append_dev(div, label);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$searchSpecs, inputFields*/ 6 && to_number(input.value) !== /*$searchSpecs*/ ctx[1]["limit"]) {
    				set_input_value(input, /*$searchSpecs*/ ctx[1]["limit"]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(59:0) <Params inputTitle=\\\"Limit\\\" inputDesc=\\\"Limit number of articles queried from server. Higher number will lead to increased server-load.\\\">",
    		ctx
    	});

    	return block;
    }

    // (66:0) <Params inputTitle="Search Term" inputDesc="Uses nearly same syntax as Google Dorks. Enable highlighting search matches.">
    function create_default_slot$3(ctx) {
    	let div;
    	let input;
    	let t0;
    	let label;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			label.textContent = "Search Term";
    			attr_dev(input, "id", "searchTerm");
    			attr_dev(input, "name", "searchTerm");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", " ");
    			attr_dev(input, "class", "svelte-85pl2h");
    			add_location(input, file$7, 67, 2, 2278);
    			attr_dev(label, "for", "searchTerm");
    			attr_dev(label, "class", "desc svelte-85pl2h");
    			add_location(label, file$7, 68, 2, 2390);
    			attr_dev(div, "class", "input svelte-85pl2h");
    			add_location(div, file$7, 66, 1, 2256);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*$searchSpecs*/ ctx[1]["searchTerm"]);
    			append_dev(div, t0);
    			append_dev(div, label);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_2*/ ctx[6]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$searchSpecs, inputFields*/ 6 && input.value !== /*$searchSpecs*/ ctx[1]["searchTerm"]) {
    				set_input_value(input, /*$searchSpecs*/ ctx[1]["searchTerm"]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(66:0) <Params inputTitle=\\\"Search Term\\\" inputDesc=\\\"Uses nearly same syntax as Google Dorks. Enable highlighting search matches.\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let params0;
    	let t0;
    	let params1;
    	let t1;
    	let params2;
    	let t2;
    	let params3;
    	let current;

    	params0 = new General$1({
    			props: {
    				inputTitle: "Timespan",
    				inputDesc: "Enter wanted date interval. Only articles published within this interval will be shown.",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	params1 = new General$1({
    			props: {
    				inputTitle: "Sorting",
    				inputDesc: "Choose how to sort articles and whether they should be sorted ascending or descending.",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	params2 = new General$1({
    			props: {
    				inputTitle: "Limit",
    				inputDesc: "Limit number of articles queried from server. Higher number will lead to increased server-load.",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	params3 = new General$1({
    			props: {
    				inputTitle: "Search Term",
    				inputDesc: "Uses nearly same syntax as Google Dorks. Enable highlighting search matches.",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(params0.$$.fragment);
    			t0 = space();
    			create_component(params1.$$.fragment);
    			t1 = space();
    			create_component(params2.$$.fragment);
    			t2 = space();
    			create_component(params3.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(params0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(params1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(params2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(params3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const params0_changes = {};

    			if (dirty & /*$$scope, $searchSpecs*/ 65538) {
    				params0_changes.$$scope = { dirty, ctx };
    			}

    			params0.$set(params0_changes);
    			const params1_changes = {};

    			if (dirty & /*$$scope, $searchSpecs*/ 65538) {
    				params1_changes.$$scope = { dirty, ctx };
    			}

    			params1.$set(params1_changes);
    			const params2_changes = {};

    			if (dirty & /*$$scope, $searchSpecs*/ 65538) {
    				params2_changes.$$scope = { dirty, ctx };
    			}

    			params2.$set(params2_changes);
    			const params3_changes = {};

    			if (dirty & /*$$scope, $searchSpecs*/ 65538) {
    				params3_changes.$$scope = { dirty, ctx };
    			}

    			params3.$set(params3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(params0.$$.fragment, local);
    			transition_in(params1.$$.fragment, local);
    			transition_in(params2.$$.fragment, local);
    			transition_in(params3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(params0.$$.fragment, local);
    			transition_out(params1.$$.fragment, local);
    			transition_out(params2.$$.fragment, local);
    			transition_out(params3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(params0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(params1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(params2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(params3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $searchSpecs,
    		$$unsubscribe_searchSpecs = noop,
    		$$subscribe_searchSpecs = () => ($$unsubscribe_searchSpecs(), $$unsubscribe_searchSpecs = subscribe(searchSpecs, $$value => $$invalidate(1, $searchSpecs = $$value)), searchSpecs);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_searchSpecs());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchQuery', slots, []);

    	const inputFields = {
    		"timespan": [
    			{
    				"readable": "First Date",
    				"name": "firstDate"
    			},
    			{
    				"readable": "Last Date",
    				"name": "lastDate"
    			}
    		],
    		"sorting": [
    			{
    				"readable": "Sort Order",
    				"name": "sortOrder",
    				"options": [["desc", "Descending"], ["asc", "Ascending"]]
    			},
    			{
    				"readable": "Sort By",
    				"name": "sortBy",
    				"options": [
    					["publish_date", "Publish Date"],
    					["read_times", "Times read"],
    					["source", "Source"],
    					["author", "Author"],
    					["url", "URL"],
    					["inserted_at", "Time of scraping"]
    				]
    			}
    		]
    	};

    	let { searchSpecs } = $$props;
    	validate_store(searchSpecs, 'searchSpecs');
    	$$subscribe_searchSpecs();
    	const writable_props = ['searchSpecs'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchQuery> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler(inputDesc) {
    		$searchSpecs[inputDesc.name] = this.value;
    		searchSpecs.set($searchSpecs);
    		$$invalidate(2, inputFields);
    	}

    	function select_change_handler(inputDesc) {
    		$searchSpecs[inputDesc.name] = select_value(this);
    		searchSpecs.set($searchSpecs);
    		$$invalidate(2, inputFields);
    	}

    	function input_input_handler_1() {
    		$searchSpecs["limit"] = to_number(this.value);
    		searchSpecs.set($searchSpecs);
    		$$invalidate(2, inputFields);
    	}

    	function input_input_handler_2() {
    		$searchSpecs["searchTerm"] = this.value;
    		searchSpecs.set($searchSpecs);
    		$$invalidate(2, inputFields);
    	}

    	$$self.$$set = $$props => {
    		if ('searchSpecs' in $$props) $$subscribe_searchSpecs($$invalidate(0, searchSpecs = $$props.searchSpecs));
    	};

    	$$self.$capture_state = () => ({
    		Params: General$1,
    		inputFields,
    		searchSpecs,
    		$searchSpecs
    	});

    	$$self.$inject_state = $$props => {
    		if ('searchSpecs' in $$props) $$subscribe_searchSpecs($$invalidate(0, searchSpecs = $$props.searchSpecs));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		searchSpecs,
    		$searchSpecs,
    		inputFields,
    		input_input_handler,
    		select_change_handler,
    		input_input_handler_1,
    		input_input_handler_2
    	];
    }

    class SearchQuery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { searchSpecs: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchQuery",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*searchSpecs*/ ctx[0] === undefined && !('searchSpecs' in props)) {
    			console.warn("<SearchQuery> was created without expected prop 'searchSpecs'");
    		}
    	}

    	get searchSpecs() {
    		throw new Error("<SearchQuery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchSpecs(value) {
    		throw new Error("<SearchQuery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/modals/search/title.svelte generated by Svelte v3.48.0 */
    const file$6 = "src/components/modals/search/title.svelte";

    function create_fragment$6(ctx) {
    	let h1;
    	let t;
    	let collapse;
    	let updating_open;
    	let current;

    	function collapse_open_binding(value) {
    		/*collapse_open_binding*/ ctx[2](value);
    	}

    	let collapse_props = {};

    	if (/*open*/ ctx[0] !== void 0) {
    		collapse_props.open = /*open*/ ctx[0];
    	}

    	collapse = new CollapseArrow({ props: collapse_props, $$inline: true });
    	binding_callbacks.push(() => bind(collapse, 'open', collapse_open_binding));

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text(/*title*/ ctx[1]);
    			create_component(collapse.$$.fragment);
    			attr_dev(h1, "class", "svelte-grmbna");
    			add_location(h1, file$6, 7, 0, 114);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    			mount_component(collapse, h1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    			const collapse_changes = {};

    			if (!updating_open && dirty & /*open*/ 1) {
    				updating_open = true;
    				collapse_changes.open = /*open*/ ctx[0];
    				add_flush_callback(() => updating_open = false);
    			}

    			collapse.$set(collapse_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(collapse.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(collapse.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			destroy_component(collapse);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Title', slots, []);
    	let { title } = $$props;
    	let { open } = $$props;
    	const writable_props = ['title', 'open'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Title> was created with unknown prop '${key}'`);
    	});

    	function collapse_open_binding(value) {
    		open = value;
    		$$invalidate(0, open);
    	}

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    	};

    	$$self.$capture_state = () => ({ Collapse: CollapseArrow, title, open });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [open, title, collapse_open_binding];
    }

    class Title extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { title: 1, open: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[1] === undefined && !('title' in props)) {
    			console.warn("<Title> was created without expected prop 'title'");
    		}

    		if (/*open*/ ctx[0] === undefined && !('open' in props)) {
    			console.warn("<Title> was created without expected prop 'open'");
    		}
    	}

    	get title() {
    		throw new Error("<Title>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Title>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<Title>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Title>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/modals/search/main.svelte generated by Svelte v3.48.0 */
    const file$5 = "src/components/modals/search/main.svelte";

    // (1:0) <script>  import SourceSelect from "./sourceSelect.svelte"  import SearchQuery from "./searchQuery.svelte"  import Modal from "../modal.svelte"  import Loader from "../../shared/loader.svelte"  import MenuTypeTitle from "./title.svelte"   import { appConfig }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>  import SourceSelect from \\\"./sourceSelect.svelte\\\"  import SearchQuery from \\\"./searchQuery.svelte\\\"  import Modal from \\\"../modal.svelte\\\"  import Loader from \\\"../../shared/loader.svelte\\\"  import MenuTypeTitle from \\\"./title.svelte\\\"   import { appConfig }",
    		ctx
    	});

    	return block;
    }

    // (50:1) {:then sourceList}
    function create_then_block(ctx) {
    	let div2;
    	let div0;
    	let menutypetitle0;
    	let updating_open;
    	let t0;
    	let t1;
    	let hr0;
    	let t2;
    	let div1;
    	let menutypetitle1;
    	let updating_open_1;
    	let t3;
    	let t4;
    	let hr1;
    	let t5;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	function menutypetitle0_open_binding(value) {
    		/*menutypetitle0_open_binding*/ ctx[4](value);
    	}

    	let menutypetitle0_props = { title: "Select Sources" };

    	if (/*openSourceSelect*/ ctx[0] !== void 0) {
    		menutypetitle0_props.open = /*openSourceSelect*/ ctx[0];
    	}

    	menutypetitle0 = new Title({
    			props: menutypetitle0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(menutypetitle0, 'open', menutypetitle0_open_binding));
    	let if_block0 = /*openSourceSelect*/ ctx[0] && create_if_block_1$2(ctx);

    	function menutypetitle1_open_binding(value) {
    		/*menutypetitle1_open_binding*/ ctx[5](value);
    	}

    	let menutypetitle1_props = { title: "Search Query" };

    	if (/*openSearchQuery*/ ctx[1] !== void 0) {
    		menutypetitle1_props.open = /*openSearchQuery*/ ctx[1];
    	}

    	menutypetitle1 = new Title({
    			props: menutypetitle1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(menutypetitle1, 'open', menutypetitle1_open_binding));
    	let if_block1 = /*openSearchQuery*/ ctx[1] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(menutypetitle0.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			hr0 = element("hr");
    			t2 = space();
    			div1 = element("div");
    			create_component(menutypetitle1.$$.fragment);
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			hr1 = element("hr");
    			t5 = space();
    			button = element("button");
    			button.textContent = "Search content";
    			attr_dev(div0, "class", "half svelte-11xc9sn");
    			add_location(div0, file$5, 51, 3, 1560);
    			attr_dev(hr0, "class", "separator svelte-11xc9sn");
    			add_location(hr0, file$5, 60, 3, 1846);
    			attr_dev(hr1, "class", "separator svelte-11xc9sn");
    			add_location(hr1, file$5, 70, 4, 2136);
    			attr_dev(button, "class", "svelte-11xc9sn");
    			add_location(button, file$5, 72, 4, 2164);
    			attr_dev(div1, "class", "half svelte-11xc9sn");
    			add_location(div1, file$5, 62, 3, 1873);
    			attr_dev(div2, "class", "contentContainer svelte-11xc9sn");
    			add_location(div2, file$5, 50, 2, 1526);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(menutypetitle0, div0, null);
    			append_dev(div0, t0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div2, t1);
    			append_dev(div2, hr0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			mount_component(menutypetitle1, div1, null);
    			append_dev(div1, t3);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t4);
    			append_dev(div1, hr1);
    			append_dev(div1, t5);
    			append_dev(div1, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const menutypetitle0_changes = {};

    			if (!updating_open && dirty & /*openSourceSelect*/ 1) {
    				updating_open = true;
    				menutypetitle0_changes.open = /*openSourceSelect*/ ctx[0];
    				add_flush_callback(() => updating_open = false);
    			}

    			menutypetitle0.$set(menutypetitle0_changes);

    			if (/*openSourceSelect*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*openSourceSelect*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const menutypetitle1_changes = {};

    			if (!updating_open_1 && dirty & /*openSearchQuery*/ 2) {
    				updating_open_1 = true;
    				menutypetitle1_changes.open = /*openSearchQuery*/ ctx[1];
    				add_flush_callback(() => updating_open_1 = false);
    			}

    			menutypetitle1.$set(menutypetitle1_changes);

    			if (/*openSearchQuery*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*openSearchQuery*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$4(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, t4);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menutypetitle0.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(menutypetitle1.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menutypetitle0.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(menutypetitle1.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(menutypetitle0);
    			if (if_block0) if_block0.d();
    			destroy_component(menutypetitle1);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(50:1) {:then sourceList}",
    		ctx
    	});

    	return block;
    }

    // (54:4) {#if openSourceSelect}
    function create_if_block_1$2(ctx) {
    	let div;
    	let sourceselect;
    	let div_transition;
    	let current;

    	sourceselect = new SourceSelect({
    			props: {
    				searchSpecs: currentSearch,
    				sourceList: /*sourceList*/ ctx[9]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(sourceselect.$$.fragment);
    			attr_dev(div, "class", "optionContainer svelte-11xc9sn");
    			add_location(div, file$5, 54, 5, 1684);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(sourceselect, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sourceselect.$$.fragment, local);

    			if (local) {
    				add_render_callback(() => {
    					if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
    					div_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sourceselect.$$.fragment, local);

    			if (local) {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
    				div_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(sourceselect);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(54:4) {#if openSourceSelect}",
    		ctx
    	});

    	return block;
    }

    // (65:4) {#if openSearchQuery}
    function create_if_block$4(ctx) {
    	let div;
    	let searchquery;
    	let div_transition;
    	let current;
    	searchquery = new SearchQuery({ props: { searchSpecs: currentSearch }, $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(searchquery.$$.fragment);
    			attr_dev(div, "class", "optionContainer seperateOptions svelte-11xc9sn");
    			add_location(div, file$5, 65, 5, 1993);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(searchquery, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchquery.$$.fragment, local);

    			if (local) {
    				add_render_callback(() => {
    					if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
    					div_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchquery.$$.fragment, local);

    			if (local) {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
    				div_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(searchquery);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(65:4) {#if openSearchQuery}",
    		ctx
    	});

    	return block;
    }

    // (48:17)    <Loader height="20%" text={true}
    function create_pending_block(ctx) {
    	let loader;
    	let current;

    	loader = new Loader({
    			props: { height: "20%", text: true },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(48:17)    <Loader height=\\\"20%\\\" text={true}",
    		ctx
    	});

    	return block;
    }

    // (47:0) <Modal>
    function create_default_slot$2(ctx) {
    	let await_block_anchor;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 9,
    		blocks: [,,,]
    	};

    	handle_promise(/*sources*/ ctx[3], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(47:0) <Modal>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, $searchSpecs, openSearchQuery, openSourceSelect*/ 1031) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $state;
    	let $feeds;
    	let $searchSpecs;
    	validate_store(state, 'state');
    	component_subscribe($$self, state, $$value => $$invalidate(7, $state = $$value));
    	validate_store(feeds, 'feeds');
    	component_subscribe($$self, feeds, $$value => $$invalidate(8, $feeds = $$value));
    	validate_store(currentSearch, 'searchSpecs');
    	component_subscribe($$self, currentSearch, $$value => $$invalidate(2, $searchSpecs = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main', slots, []);

    	onMount(async () => {
    		if (["feed", "search"].includes($state.selectedMenu.type)) {
    			for (const feedCategory in $feeds) {
    				if ($state.selectedMenu.name in $feeds[feedCategory]) {
    					let currentSearch$1 = {
    						...appConfig.defaultOptions.search,
    						...$feeds[feedCategory][$state.selectedMenu.name].searchQuery
    					};

    					if (!Boolean(currentSearch$1.sourceCategory)) {
    						currentSearch$1.sourceCategory = [];
    					}

    					currentSearch.set(currentSearch$1);
    					return;
    				}
    			}
    		}

    		currentSearch.set(structuredClone(appConfig.defaultOptions.search));
    	});

    	let sources = getArticleCategories();

    	// Variables used to control whether different segments are collapsed when screens width is small
    	let openSourceSelect = true;

    	let openSearchQuery = true;

    	window.matchMedia('(min-width: 70rem)').addListener(() => {
    		$$invalidate(0, openSourceSelect = true);
    		$$invalidate(1, openSearchQuery = true);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	function menutypetitle0_open_binding(value) {
    		openSourceSelect = value;
    		$$invalidate(0, openSourceSelect);
    	}

    	function menutypetitle1_open_binding(value) {
    		openSearchQuery = value;
    		$$invalidate(1, openSearchQuery);
    	}

    	const click_handler = () => search($searchSpecs);

    	$$self.$capture_state = () => ({
    		SourceSelect,
    		SearchQuery,
    		Modal,
    		Loader,
    		MenuTypeTitle: Title,
    		appConfig,
    		search,
    		state,
    		feeds,
    		searchSpecs: currentSearch,
    		getArticleCategories,
    		onMount,
    		slide,
    		sources,
    		openSourceSelect,
    		openSearchQuery,
    		$state,
    		$feeds,
    		$searchSpecs
    	});

    	$$self.$inject_state = $$props => {
    		if ('sources' in $$props) $$invalidate(3, sources = $$props.sources);
    		if ('openSourceSelect' in $$props) $$invalidate(0, openSourceSelect = $$props.openSourceSelect);
    		if ('openSearchQuery' in $$props) $$invalidate(1, openSearchQuery = $$props.openSearchQuery);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		openSourceSelect,
    		openSearchQuery,
    		$searchSpecs,
    		sources,
    		menutypetitle0_open_binding,
    		menutypetitle1_open_binding,
    		click_handler
    	];
    }

    class Main$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/modals/auth/general.svelte generated by Svelte v3.48.0 */
    const file$4 = "src/components/modals/auth/general.svelte";

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let logo;
    	let t0;
    	let h1;
    	let t1;
    	let t2;
    	let p;
    	let t3;
    	let t4;
    	let current;
    	logo = new Logo({ $$inline: true });
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(logo.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			t1 = text(/*title*/ ctx[0]);
    			t2 = space();
    			p = element("p");
    			t3 = text(/*message*/ ctx[1]);
    			t4 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "logo-container svelte-1ux0f85");
    			add_location(div0, file$4, 8, 1, 213);
    			attr_dev(h1, "class", "svelte-1ux0f85");
    			add_location(h1, file$4, 10, 1, 258);
    			attr_dev(p, "class", "svelte-1ux0f85");
    			add_location(p, file$4, 11, 1, 276);
    			attr_dev(div1, "class", "content-container svelte-1ux0f85");
    			set_style(div1, "padding-top", /*topPadding*/ ctx[2]);
    			add_location(div1, file$4, 7, 0, 145);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(logo, div0, null);
    			append_dev(div1, t0);
    			append_dev(div1, h1);
    			append_dev(h1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			append_dev(p, t3);
    			append_dev(div1, t4);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t1, /*title*/ ctx[0]);
    			if (!current || dirty & /*message*/ 2) set_data_dev(t3, /*message*/ ctx[1]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*topPadding*/ 4) {
    				set_style(div1, "padding-top", /*topPadding*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(logo);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('General', slots, ['default']);
    	let { title = "" } = $$props;
    	let { message = "" } = $$props;
    	let { topPadding = "10vh" } = $$props;
    	const writable_props = ['title', 'message', 'topPadding'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<General> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('message' in $$props) $$invalidate(1, message = $$props.message);
    		if ('topPadding' in $$props) $$invalidate(2, topPadding = $$props.topPadding);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ title, message, topPadding, Logo });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('message' in $$props) $$invalidate(1, message = $$props.message);
    		if ('topPadding' in $$props) $$invalidate(2, topPadding = $$props.topPadding);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, message, topPadding, $$scope, slots];
    }

    class General extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { title: 0, message: 1, topPadding: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "General",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get title() {
    		throw new Error("<General>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<General>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get message() {
    		throw new Error("<General>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<General>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get topPadding() {
    		throw new Error("<General>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topPadding(value) {
    		throw new Error("<General>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/modals/auth/inputField.svelte generated by Svelte v3.48.0 */

    const file$3 = "src/components/modals/auth/inputField.svelte";

    // (13:1) {:else}
    function create_else_block(ctx) {
    	let input;
    	let input_name_value;
    	let input_id_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "name", input_name_value = "" + (/*detailName*/ ctx[1] + "-" + /*inputType*/ ctx[2]));
    			attr_dev(input, "id", input_id_value = "" + (/*detailName*/ ctx[1] + "-" + /*inputType*/ ctx[2]));
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", " ");
    			attr_dev(input, "class", "svelte-l9cyz2");
    			add_location(input, file$3, 13, 2, 680);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*$userDetails*/ ctx[4][/*detailName*/ ctx[1]]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[6]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*detailName, inputType*/ 6 && input_name_value !== (input_name_value = "" + (/*detailName*/ ctx[1] + "-" + /*inputType*/ ctx[2]))) {
    				attr_dev(input, "name", input_name_value);
    			}

    			if (dirty & /*detailName, inputType*/ 6 && input_id_value !== (input_id_value = "" + (/*detailName*/ ctx[1] + "-" + /*inputType*/ ctx[2]))) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty & /*$userDetails, detailName*/ 18 && input.value !== /*$userDetails*/ ctx[4][/*detailName*/ ctx[1]]) {
    				set_input_value(input, /*$userDetails*/ ctx[4][/*detailName*/ ctx[1]]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(13:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:1) {#if detailName.includes("password")}
    function create_if_block$3(ctx) {
    	let input;
    	let input_name_value;
    	let input_id_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "name", input_name_value = "" + (/*detailName*/ ctx[1] + "-" + /*inputType*/ ctx[2]));
    			attr_dev(input, "id", input_id_value = "" + (/*detailName*/ ctx[1] + "-" + /*inputType*/ ctx[2]));
    			attr_dev(input, "type", "password");
    			attr_dev(input, "placeholder", " ");
    			attr_dev(input, "class", "svelte-l9cyz2");
    			add_location(input, file$3, 11, 2, 529);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*$userDetails*/ ctx[4][/*detailName*/ ctx[1]]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*detailName, inputType*/ 6 && input_name_value !== (input_name_value = "" + (/*detailName*/ ctx[1] + "-" + /*inputType*/ ctx[2]))) {
    				attr_dev(input, "name", input_name_value);
    			}

    			if (dirty & /*detailName, inputType*/ 6 && input_id_value !== (input_id_value = "" + (/*detailName*/ ctx[1] + "-" + /*inputType*/ ctx[2]))) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty & /*$userDetails, detailName*/ 18 && input.value !== /*$userDetails*/ ctx[4][/*detailName*/ ctx[1]]) {
    				set_input_value(input, /*$userDetails*/ ctx[4][/*detailName*/ ctx[1]]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(11:1) {#if detailName.includes(\\\"password\\\")}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let show_if;
    	let t0;
    	let label_1;

    	let t1_value = (/*label*/ ctx[3]
    	? /*label*/ ctx[3]
    	: /*detailName*/ ctx[1].replace("_", " ")) + "";

    	let t1;
    	let label_1_for_value;

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*detailName*/ 2) show_if = null;
    		if (show_if == null) show_if = !!/*detailName*/ ctx[1].includes("password");
    		if (show_if) return create_if_block$3;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			t0 = space();
    			label_1 = element("label");
    			t1 = text(t1_value);
    			attr_dev(label_1, "for", label_1_for_value = "" + (/*detailName*/ ctx[1] + "-" + /*inputType*/ ctx[2]));
    			attr_dev(label_1, "class", "desc svelte-l9cyz2");
    			add_location(label_1, file$3, 15, 1, 824);
    			attr_dev(div, "class", "input-container svelte-l9cyz2");
    			add_location(div, file$3, 9, 0, 458);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    			append_dev(div, t0);
    			append_dev(div, label_1);
    			append_dev(label_1, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, t0);
    				}
    			}

    			if (dirty & /*label, detailName*/ 10 && t1_value !== (t1_value = (/*label*/ ctx[3]
    			? /*label*/ ctx[3]
    			: /*detailName*/ ctx[1].replace("_", " ")) + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*detailName, inputType*/ 6 && label_1_for_value !== (label_1_for_value = "" + (/*detailName*/ ctx[1] + "-" + /*inputType*/ ctx[2]))) {
    				attr_dev(label_1, "for", label_1_for_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $userDetails,
    		$$unsubscribe_userDetails = noop,
    		$$subscribe_userDetails = () => ($$unsubscribe_userDetails(), $$unsubscribe_userDetails = subscribe(userDetails, $$value => $$invalidate(4, $userDetails = $$value)), userDetails);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_userDetails());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputField', slots, []);
    	let { userDetails } = $$props;
    	validate_store(userDetails, 'userDetails');
    	$$subscribe_userDetails();
    	let { detailName } = $$props;
    	let { inputType } = $$props;
    	let { label = false } = $$props;
    	const writable_props = ['userDetails', 'detailName', 'inputType', 'label'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputField> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		$userDetails[detailName] = this.value;
    		userDetails.set($userDetails);
    	}

    	function input_input_handler_1() {
    		$userDetails[detailName] = this.value;
    		userDetails.set($userDetails);
    	}

    	$$self.$$set = $$props => {
    		if ('userDetails' in $$props) $$subscribe_userDetails($$invalidate(0, userDetails = $$props.userDetails));
    		if ('detailName' in $$props) $$invalidate(1, detailName = $$props.detailName);
    		if ('inputType' in $$props) $$invalidate(2, inputType = $$props.inputType);
    		if ('label' in $$props) $$invalidate(3, label = $$props.label);
    	};

    	$$self.$capture_state = () => ({
    		userDetails,
    		detailName,
    		inputType,
    		label,
    		$userDetails
    	});

    	$$self.$inject_state = $$props => {
    		if ('userDetails' in $$props) $$subscribe_userDetails($$invalidate(0, userDetails = $$props.userDetails));
    		if ('detailName' in $$props) $$invalidate(1, detailName = $$props.detailName);
    		if ('inputType' in $$props) $$invalidate(2, inputType = $$props.inputType);
    		if ('label' in $$props) $$invalidate(3, label = $$props.label);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		userDetails,
    		detailName,
    		inputType,
    		label,
    		$userDetails,
    		input_input_handler,
    		input_input_handler_1
    	];
    }

    class InputField extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			userDetails: 0,
    			detailName: 1,
    			inputType: 2,
    			label: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputField",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*userDetails*/ ctx[0] === undefined && !('userDetails' in props)) {
    			console.warn("<InputField> was created without expected prop 'userDetails'");
    		}

    		if (/*detailName*/ ctx[1] === undefined && !('detailName' in props)) {
    			console.warn("<InputField> was created without expected prop 'detailName'");
    		}

    		if (/*inputType*/ ctx[2] === undefined && !('inputType' in props)) {
    			console.warn("<InputField> was created without expected prop 'inputType'");
    		}
    	}

    	get userDetails() {
    		throw new Error("<InputField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set userDetails(value) {
    		throw new Error("<InputField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get detailName() {
    		throw new Error("<InputField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set detailName(value) {
    		throw new Error("<InputField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputType() {
    		throw new Error("<InputField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputType(value) {
    		throw new Error("<InputField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<InputField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<InputField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/modals/auth/main.svelte generated by Svelte v3.48.0 */

    const { Boolean: Boolean_1 } = globals;
    const file$2 = "src/components/modals/auth/main.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    // (164:28) 
    function create_if_block_3$1(ctx) {
    	let general;
    	let current;

    	general = new General({
    			props: {
    				title: /*$modalState*/ ctx[0].modalContent.title,
    				message: /*$modalState*/ ctx[0].modalContent.desc,
    				topPadding: "7vh"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(general.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(general, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const general_changes = {};
    			if (dirty & /*$modalState*/ 1) general_changes.title = /*$modalState*/ ctx[0].modalContent.title;
    			if (dirty & /*$modalState*/ 1) general_changes.message = /*$modalState*/ ctx[0].modalContent.desc;
    			general.$set(general_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(general.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(general.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(general, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(164:28) ",
    		ctx
    	});

    	return block;
    }

    // (147:27) 
    function create_if_block_2$1(ctx) {
    	let general;
    	let current;

    	general = new General({
    			props: {
    				title: /*$modalState*/ ctx[0].modalContent.title,
    				message: /*$modalState*/ ctx[0].modalContent.desc,
    				topPadding: "10vh",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(general.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(general, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const general_changes = {};
    			if (dirty & /*$modalState*/ 1) general_changes.title = /*$modalState*/ ctx[0].modalContent.title;
    			if (dirty & /*$modalState*/ 1) general_changes.message = /*$modalState*/ ctx[0].modalContent.desc;

    			if (dirty & /*$$scope, $modalState, missingDetailMsg, loginReady, $details*/ 8388679) {
    				general_changes.$$scope = { dirty, ctx };
    			}

    			general.$set(general_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(general.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(general.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(general, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(147:27) ",
    		ctx
    	});

    	return block;
    }

    // (134:28) 
    function create_if_block_1$1(ctx) {
    	let general;
    	let current;

    	general = new General({
    			props: {
    				title: /*$modalState*/ ctx[0].modalContent.title,
    				message: /*$modalState*/ ctx[0].modalContent.desc,
    				topPadding: "7vh",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(general.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(general, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const general_changes = {};
    			if (dirty & /*$modalState*/ 1) general_changes.title = /*$modalState*/ ctx[0].modalContent.title;
    			if (dirty & /*$modalState*/ 1) general_changes.message = /*$modalState*/ ctx[0].modalContent.desc;

    			if (dirty & /*$$scope, $modalState, missingDetailMsg, signupReady*/ 8388619) {
    				general_changes.$$scope = { dirty, ctx };
    			}

    			general.$set(general_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(general.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(general.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(general, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(134:28) ",
    		ctx
    	});

    	return block;
    }

    // (132:1) {#if loading}
    function create_if_block$2(ctx) {
    	let loader;
    	let current;

    	loader = new Loader({
    			props: { width: "20%", text: true },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(132:1) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (150:4) {#each ["username", "password"] as detailName}
    function create_each_block_1(ctx) {
    	let inputfield;
    	let current;

    	inputfield = new InputField({
    			props: {
    				detailName: /*detailName*/ ctx[18],
    				inputType: "login",
    				userDetails: /*details*/ ctx[7]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(inputfield.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(inputfield, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputfield.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputfield.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inputfield, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(150:4) {#each [\\\"username\\\", \\\"password\\\"] as detailName}",
    		ctx
    	});

    	return block;
    }

    // (148:2) <General title="{$modalState.modalContent.title}" message="{$modalState.modalContent.desc}" topPadding="10vh">
    function create_default_slot_2(ctx) {
    	let form;
    	let t0;
    	let div;
    	let input;
    	let t1;
    	let label;
    	let t3;
    	let a0;
    	let t5;
    	let hr;
    	let t6;
    	let button;
    	let t7;
    	let button_title_value;
    	let button_disabled_value;
    	let t8;
    	let p;
    	let t9;
    	let a1;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = ["username", "password"];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < 2; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			form = element("form");

    			for (let i = 0; i < 2; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div = element("div");
    			input = element("input");
    			t1 = space();
    			label = element("label");
    			label.textContent = "Remember Me";
    			t3 = space();
    			a0 = element("a");
    			a0.textContent = "Forgot password?";
    			t5 = space();
    			hr = element("hr");
    			t6 = space();
    			button = element("button");
    			t7 = text("Login");
    			t8 = space();
    			p = element("p");
    			t9 = text("Not a user yet? ");
    			a1 = element("a");
    			a1.textContent = "Sign up here";
    			attr_dev(input, "class", "switch svelte-5np7xc");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", "remember");
    			attr_dev(input, "name", "remember");
    			input.__value = "True";
    			input.value = input.__value;
    			attr_dev(input, "unchecked", "");
    			add_location(input, file$2, 154, 5, 5067);
    			attr_dev(label, "class", "switch svelte-5np7xc");
    			attr_dev(label, "for", "remember");
    			add_location(label, file$2, 155, 5, 5200);
    			attr_dev(a0, "href", '#');
    			attr_dev(a0, "class", "svelte-5np7xc");
    			add_location(a0, file$2, 156, 5, 5262);
    			attr_dev(div, "class", "details svelte-5np7xc");
    			add_location(div, file$2, 153, 4, 5040);
    			attr_dev(hr, "class", "svelte-5np7xc");
    			add_location(hr, file$2, 158, 4, 5366);
    			attr_dev(form, "class", "svelte-5np7xc");
    			add_location(form, file$2, 148, 3, 4878);

    			attr_dev(button, "title", button_title_value = /*missingDetailMsg*/ ctx[1]
    			? /*missingDetailMsg*/ ctx[1]
    			: "");

    			button.disabled = button_disabled_value = !/*loginReady*/ ctx[2];
    			attr_dev(button, "class", "svelte-5np7xc");
    			add_location(button, file$2, 160, 3, 5385);
    			attr_dev(a1, "href", '#');
    			attr_dev(a1, "class", "svelte-5np7xc");
    			add_location(a1, file$2, 161, 37, 5538);
    			attr_dev(p, "class", "bottom svelte-5np7xc");
    			add_location(p, file$2, 161, 3, 5504);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);

    			for (let i = 0; i < 2; i += 1) {
    				each_blocks[i].m(form, null);
    			}

    			append_dev(form, t0);
    			append_dev(form, div);
    			append_dev(div, input);
    			input.checked = /*$details*/ ctx[6].remember_me;
    			append_dev(div, t1);
    			append_dev(div, label);
    			append_dev(div, t3);
    			append_dev(div, a0);
    			append_dev(form, t5);
    			append_dev(form, hr);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, button, anchor);
    			append_dev(button, t7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t9);
    			append_dev(p, a1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[14]),
    					listen_dev(a0, "click", prevent_default(/*handleForgottenPassword*/ ctx[10]), false, true, false),
    					listen_dev(button, "click", /*login*/ ctx[8], false, false, false),
    					listen_dev(a1, "click", prevent_default(/*click_handler_1*/ ctx[15]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*details*/ 128) {
    				each_value_1 = ["username", "password"];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < 2; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(form, t0);
    					}
    				}

    				group_outros();

    				for (i = 2; i < 2; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*$details*/ 64) {
    				input.checked = /*$details*/ ctx[6].remember_me;
    			}

    			if (!current || dirty & /*missingDetailMsg*/ 2 && button_title_value !== (button_title_value = /*missingDetailMsg*/ ctx[1]
    			? /*missingDetailMsg*/ ctx[1]
    			: "")) {
    				attr_dev(button, "title", button_title_value);
    			}

    			if (!current || dirty & /*loginReady*/ 4 && button_disabled_value !== (button_disabled_value = !/*loginReady*/ ctx[2])) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < 2; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean_1);

    			for (let i = 0; i < 2; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(p);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(148:2) <General title=\\\"{$modalState.modalContent.title}\\\" message=\\\"{$modalState.modalContent.desc}\\\" topPadding=\\\"10vh\\\">",
    		ctx
    	});

    	return block;
    }

    // (137:4) {#each ["username", "password", "repeat_password"] as detailName}
    function create_each_block(ctx) {
    	let inputfield;
    	let current;

    	inputfield = new InputField({
    			props: {
    				detailName: /*detailName*/ ctx[18],
    				inputType: "signup",
    				userDetails: /*details*/ ctx[7]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(inputfield.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(inputfield, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputfield.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputfield.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inputfield, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(137:4) {#each [\\\"username\\\", \\\"password\\\", \\\"repeat_password\\\"] as detailName}",
    		ctx
    	});

    	return block;
    }

    // (135:2) <General title="{$modalState.modalContent.title}" message="{$modalState.modalContent.desc}" topPadding="7vh">
    function create_default_slot_1(ctx) {
    	let form;
    	let t0;
    	let hr0;
    	let t1;
    	let inputfield;
    	let t2;
    	let hr1;
    	let t3;
    	let button;
    	let t4;
    	let button_title_value;
    	let button_disabled_value;
    	let t5;
    	let p;
    	let t6;
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = ["username", "password", "repeat_password"];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 3; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	inputfield = new InputField({
    			props: {
    				detailName: "email",
    				inputType: "signup",
    				userDetails: /*details*/ ctx[7],
    				label: "Email - (Optional)"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form = element("form");

    			for (let i = 0; i < 3; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			hr0 = element("hr");
    			t1 = space();
    			create_component(inputfield.$$.fragment);
    			t2 = space();
    			hr1 = element("hr");
    			t3 = space();
    			button = element("button");
    			t4 = text("Sign Up");
    			t5 = space();
    			p = element("p");
    			t6 = text("Already a user? ");
    			a = element("a");
    			a.textContent = "Login here";
    			attr_dev(hr0, "class", "svelte-5np7xc");
    			add_location(hr0, file$2, 139, 4, 4285);
    			attr_dev(hr1, "class", "svelte-5np7xc");
    			add_location(hr1, file$2, 141, 4, 4401);
    			attr_dev(form, "class", "svelte-5np7xc");
    			add_location(form, file$2, 135, 3, 4104);

    			attr_dev(button, "title", button_title_value = /*missingDetailMsg*/ ctx[1]
    			? /*missingDetailMsg*/ ctx[1]
    			: "");

    			button.disabled = button_disabled_value = !/*signupReady*/ ctx[3];
    			attr_dev(button, "class", "svelte-5np7xc");
    			add_location(button, file$2, 143, 3, 4420);
    			attr_dev(a, "href", '#');
    			attr_dev(a, "class", "svelte-5np7xc");
    			add_location(a, file$2, 144, 37, 4577);
    			attr_dev(p, "class", "bottom svelte-5np7xc");
    			add_location(p, file$2, 144, 3, 4543);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);

    			for (let i = 0; i < 3; i += 1) {
    				each_blocks[i].m(form, null);
    			}

    			append_dev(form, t0);
    			append_dev(form, hr0);
    			append_dev(form, t1);
    			mount_component(inputfield, form, null);
    			append_dev(form, t2);
    			append_dev(form, hr1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button, anchor);
    			append_dev(button, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t6);
    			append_dev(p, a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*signup*/ ctx[9], false, false, false),
    					listen_dev(a, "click", prevent_default(/*click_handler*/ ctx[13]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*details*/ 128) {
    				each_value = ["username", "password", "repeat_password"];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 3; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(form, t0);
    					}
    				}

    				group_outros();

    				for (i = 3; i < 3; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*missingDetailMsg*/ 2 && button_title_value !== (button_title_value = /*missingDetailMsg*/ ctx[1]
    			? /*missingDetailMsg*/ ctx[1]
    			: "")) {
    				attr_dev(button, "title", button_title_value);
    			}

    			if (!current || dirty & /*signupReady*/ 8 && button_disabled_value !== (button_disabled_value = !/*signupReady*/ ctx[3])) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < 3; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(inputfield.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean_1);

    			for (let i = 0; i < 3; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(inputfield.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_each(each_blocks, detaching);
    			destroy_component(inputfield);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(p);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(135:2) <General title=\\\"{$modalState.modalContent.title}\\\" message=\\\"{$modalState.modalContent.desc}\\\" topPadding=\\\"7vh\\\">",
    		ctx
    	});

    	return block;
    }

    // (131:0) <Modal height="clamp(60vh, 80ex, 80vh)" width="min(60ch, 80vw)">
    function create_default_slot$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_1$1, create_if_block_2$1, create_if_block_3$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[4]) return 0;
    		if (/*type*/ ctx[5] == "signup") return 1;
    		if (/*type*/ ctx[5] == "login") return 2;
    		if (/*type*/ ctx[5] == "result") return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(131:0) <Modal height=\\\"clamp(60vh, 80ex, 80vh)\\\" width=\\\"min(60ch, 80vw)\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let modal;
    	let current;
    	let mounted;
    	let dispose;

    	modal = new Modal({
    			props: {
    				height: "clamp(60vh, 80ex, 80vh)",
    				width: "min(60ch, 80vw)",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keydown", /*keydown_handler*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, loading, $modalState, missingDetailMsg, signupReady, type, loginReady, $details*/ 8388735) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let type;
    	let $modalState;
    	let $details;
    	validate_store(modalState, 'modalState');
    	component_subscribe($$self, modalState, $$value => $$invalidate(0, $modalState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main', slots, []);
    	const details = writable({});
    	validate_store(details, 'details');
    	component_subscribe($$self, details, value => $$invalidate(6, $details = value));
    	let missingDetailMsg = "";
    	let loginReady = false;
    	let signupReady = false;
    	let loading = false;

    	const detailUnsubscribe = details.subscribe(detailValues => {
    		if (!(Boolean(detailValues.username) && Boolean(detailValues.password))) {
    			$$invalidate(1, missingDetailMsg = "Please specify both password and username");
    			$$invalidate(2, loginReady = false);
    			$$invalidate(3, signupReady = false);
    			return;
    		}

    		$$invalidate(2, loginReady = true);

    		if (type == "signup") {
    			if (!(detailValues.repeat_password === detailValues.password)) {
    				$$invalidate(1, missingDetailMsg = "Passwords doesn't match");
    				$$invalidate(3, signupReady = false);
    				return;
    			}

    			$$invalidate(3, signupReady = true);
    		} else {
    			$$invalidate(3, signupReady = false);
    		}

    		$$invalidate(1, missingDetailMsg = false);
    	});

    	async function handleResponse(response, successMsg) {
    		if (response === true) {
    			set_store_value(
    				modalState,
    				$modalState.modalContent = {
    					"title": "Success!",
    					"desc": successMsg,
    					"type": $modalState.modalContent.type == "signup"
    					? "login"
    					: "result"
    				},
    				$modalState
    			);

    			return true;
    		} else {
    			try {
    				let error = await response.json();

    				set_store_value(
    					modalState,
    					$modalState.modalContent = {
    						"title": "Failure!",
    						"desc": error["detail"],
    						"type": $modalState.modalContent.type,
    						"status": "failure"
    					},
    					$modalState
    				);

    				return false;
    			} catch {
    				set_store_value(
    					modalState,
    					$modalState.modalContent = {
    						"title": "Whoops!",
    						"desc": "An unexpected error occured, please try again",
    						"type": $modalState.modalContent.type,
    						"status": "failure"
    					},
    					$modalState
    				);

    				return false;
    			}
    		}
    	}

    	async function login$1() {
    		if (loginReady) {
    			$$invalidate(4, loading = true);
    			let authResponse = await login($details.username, $details.password, $details.remember_me);
    			let success = await handleResponse(authResponse, "You're now logged in!");
    			$$invalidate(4, loading = false);

    			if (success) {
    				await getUserFeeds();
    				await getUserCollections();
    			}
    		}
    	}

    	async function signup$1() {
    		if (signupReady) {
    			$$invalidate(4, loading = true);
    			let authResponse = await signup($details.username, $details.password);
    			await handleResponse(authResponse, "You're now signed up! Login below to continue.");
    			$$invalidate(4, loading = false);
    		}
    	}

    	async function handleForgottenPassword() {
    		$$invalidate(4, loading = true);
    		await queryAPI("/auth/forgotten-password");
    		$$invalidate(4, loading = false);

    		// The actual check that should be used once password recovery by email is implemented
    		//if (Boolean(recoveryAvailable) && recoveryAvailable.available) {
    		{
    			set_store_value(
    				modalState,
    				$modalState.modalContent = {
    					"title": "Recover password",
    					"desc": "As this instance of OSINTer doesn't support password recovery by email, you will have to contact you system administrator to get it reset",
    					"type": "result"
    				},
    				$modalState
    			);
    		}
    	}

    	async function handleKeypress(keyName) {
    		if (keyName == "Enter") {
    			if (type == "signup") {
    				signup$1();
    			} else if (type == "login") {
    				login$1();
    			}
    		}
    	}

    	onDestroy(detailUnsubscribe);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	const keydown_handler = e => handleKeypress(e.key);
    	const click_handler = () => set_store_value(modalState, $modalState = structuredClone(appConfig.defaultOptions.modalStates.login), $modalState);

    	function input_change_handler() {
    		$details.remember_me = this.checked;
    		details.set($details);
    	}

    	const click_handler_1 = () => set_store_value(modalState, $modalState = structuredClone(appConfig.defaultOptions.modalStates.signup), $modalState);

    	$$self.$capture_state = () => ({
    		Modal,
    		General,
    		InputField,
    		Loader,
    		modalState,
    		loginState,
    		appConfig,
    		queryLogin: login,
    		querySignup: signup,
    		getUserFeeds,
    		getUserCollections,
    		queryAPI,
    		onDestroy,
    		writable,
    		details,
    		missingDetailMsg,
    		loginReady,
    		signupReady,
    		loading,
    		detailUnsubscribe,
    		handleResponse,
    		login: login$1,
    		signup: signup$1,
    		handleForgottenPassword,
    		handleKeypress,
    		type,
    		$modalState,
    		$details
    	});

    	$$self.$inject_state = $$props => {
    		if ('missingDetailMsg' in $$props) $$invalidate(1, missingDetailMsg = $$props.missingDetailMsg);
    		if ('loginReady' in $$props) $$invalidate(2, loginReady = $$props.loginReady);
    		if ('signupReady' in $$props) $$invalidate(3, signupReady = $$props.signupReady);
    		if ('loading' in $$props) $$invalidate(4, loading = $$props.loading);
    		if ('type' in $$props) $$invalidate(5, type = $$props.type);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$modalState*/ 1) {
    			$$invalidate(5, type = $modalState && "modalContent" in $modalState && Boolean($modalState.modalContent) && "type" in $modalState.modalContent
    			? $modalState.modalContent.type
    			: false);
    		}
    	};

    	return [
    		$modalState,
    		missingDetailMsg,
    		loginReady,
    		signupReady,
    		loading,
    		type,
    		$details,
    		details,
    		login$1,
    		signup$1,
    		handleForgottenPassword,
    		handleKeypress,
    		keydown_handler,
    		click_handler,
    		input_change_handler,
    		click_handler_1
    	];
    }

    class Main extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/modals/getName.svelte generated by Svelte v3.48.0 */
    const file$1 = "src/components/modals/getName.svelte";

    // (15:1) {#if $modalState.modalContent}
    function create_if_block$1(ctx) {
    	let div1;
    	let div0;
    	let input;
    	let t0;
    	let label;
    	let t1_value = /*$modalState*/ ctx[1].modalContent.userAction + "";
    	let t1;
    	let t2;
    	let button;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icons({
    			props: { name: "send-plus" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			t1 = text(t1_value);
    			t2 = space();
    			button = element("button");
    			create_component(icon.$$.fragment);
    			attr_dev(input, "name", "get-name");
    			attr_dev(input, "id", "get-name");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", " ");
    			attr_dev(input, "class", "svelte-1oezmmk");
    			add_location(input, file$1, 17, 4, 672);
    			attr_dev(label, "for", "get-name");
    			attr_dev(label, "class", "desc svelte-1oezmmk");
    			add_location(label, file$1, 18, 4, 763);
    			attr_dev(button, "class", "svelte-1oezmmk");
    			toggle_class(button, "ready", /*readyToCreate*/ ctx[2]);
    			add_location(button, file$1, 19, 4, 850);
    			attr_dev(div0, "class", "input-container svelte-1oezmmk");
    			add_location(div0, file$1, 16, 3, 638);
    			attr_dev(div1, "class", "content-container svelte-1oezmmk");
    			add_location(div1, file$1, 15, 2, 603);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*content*/ ctx[0]);
    			append_dev(div0, t0);
    			append_dev(div0, label);
    			append_dev(label, t1);
    			append_dev(div0, t2);
    			append_dev(div0, button);
    			mount_component(icon, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[4]),
    					listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*content*/ 1 && input.value !== /*content*/ ctx[0]) {
    				set_input_value(input, /*content*/ ctx[0]);
    			}

    			if ((!current || dirty & /*$modalState*/ 2) && t1_value !== (t1_value = /*$modalState*/ ctx[1].modalContent.userAction + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*readyToCreate*/ 4) {
    				toggle_class(button, "ready", /*readyToCreate*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(icon);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(15:1) {#if $modalState.modalContent}",
    		ctx
    	});

    	return block;
    }

    // (14:0) <Modal height="" width="">
    function create_default_slot(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$modalState*/ ctx[1].modalContent && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$modalState*/ ctx[1].modalContent) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$modalState*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(14:0) <Modal height=\\\"\\\" width=\\\"\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let modal;
    	let current;
    	let mounted;
    	let dispose;

    	modal = new Modal({
    			props: {
    				height: "",
    				width: "",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keydown", /*keydown_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, readyToCreate, $modalState, content*/ 71) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let readyToCreate;
    	let $modalState;
    	validate_store(modalState, 'modalState');
    	component_subscribe($$self, modalState, $$value => $$invalidate(1, $modalState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GetName', slots, []);
    	let content = "";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GetName> was created with unknown prop '${key}'`);
    	});

    	const keydown_handler = e => {
    		if (e.key === "Enter" && readyToCreate) {
    			$modalState.modalContent.action(content);
    		}
    	};

    	function input_input_handler() {
    		content = this.value;
    		$$invalidate(0, content);
    	}

    	const click_handler = () => {
    		if (readyToCreate) {
    			$modalState.modalContent.action(content);
    		}
    	};

    	$$self.$capture_state = () => ({
    		Modal,
    		Icon: Icons,
    		modalState,
    		content,
    		readyToCreate,
    		$modalState
    	});

    	$$self.$inject_state = $$props => {
    		if ('content' in $$props) $$invalidate(0, content = $$props.content);
    		if ('readyToCreate' in $$props) $$invalidate(2, readyToCreate = $$props.readyToCreate);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*content, $modalState*/ 3) {
    			$$invalidate(2, readyToCreate = content.length > 0 && Boolean($modalState.modalContent) && "existingNames" in $modalState.modalContent && Array.isArray($modalState.modalContent.existingNames) && !$modalState.modalContent.existingNames.includes(content));
    		}
    	};

    	return [
    		content,
    		$modalState,
    		readyToCreate,
    		keydown_handler,
    		input_input_handler,
    		click_handler
    	];
    }

    class GetName extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GetName",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.48.0 */
    const file = "src/App.svelte";

    // (61:46) 
    function create_if_block_3(ctx) {
    	let getnamemodal;
    	let current;
    	getnamemodal = new GetName({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(getnamemodal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(getnamemodal, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(getnamemodal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(getnamemodal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(getnamemodal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(61:46) ",
    		ctx
    	});

    	return block;
    }

    // (59:43) 
    function create_if_block_2(ctx) {
    	let authmodal;
    	let current;
    	authmodal = new Main({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(authmodal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(authmodal, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(authmodal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(authmodal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(authmodal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(59:43) ",
    		ctx
    	});

    	return block;
    }

    // (57:45) 
    function create_if_block_1(ctx) {
    	let searchmodal;
    	let current;
    	searchmodal = new Main$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(searchmodal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(searchmodal, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchmodal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchmodal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(searchmodal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(57:45) ",
    		ctx
    	});

    	return block;
    }

    // (55:1) {#if $modalState.modalType == "article" && $modalState.modalContent}
    function create_if_block(ctx) {
    	let articlemodal;
    	let current;

    	articlemodal = new Article({
    			props: {
    				articleObject: /*$modalState*/ ctx[0].modalContent
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(articlemodal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(articlemodal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const articlemodal_changes = {};
    			if (dirty & /*$modalState*/ 1) articlemodal_changes.articleObject = /*$modalState*/ ctx[0].modalContent;
    			articlemodal.$set(articlemodal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(articlemodal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(articlemodal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(articlemodal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(55:1) {#if $modalState.modalType == \\\"article\\\" && $modalState.modalContent}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let t0;
    	let sidebar;
    	let t1;
    	let mainwindow;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$modalState*/ ctx[0].modalType == "article" && /*$modalState*/ ctx[0].modalContent) return 0;
    		if (/*$modalState*/ ctx[0].modalType == "search") return 1;
    		if (/*$modalState*/ ctx[0].modalType == "auth") return 2;
    		if (/*$modalState*/ ctx[0].modalType == "getName") return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	sidebar = new Main$3({ $$inline: true });
    	mainwindow = new Main_window({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block) if_block.c();
    			t0 = space();
    			create_component(sidebar.$$.fragment);
    			t1 = space();
    			create_component(mainwindow.$$.fragment);
    			attr_dev(main, "class", "svelte-18pgdwq");
    			add_location(main, file, 53, 0, 1565);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(main, null);
    			}

    			append_dev(main, t0);
    			mount_component(sidebar, main, null);
    			append_dev(main, t1);
    			mount_component(mainwindow, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keydown", /*keydown_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(main, t0);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(sidebar.$$.fragment, local);
    			transition_in(mainwindow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(sidebar.$$.fragment, local);
    			transition_out(mainwindow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			destroy_component(sidebar);
    			destroy_component(mainwindow);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $currentSearch;
    	let $modalState;
    	validate_store(currentSearch, 'currentSearch');
    	component_subscribe($$self, currentSearch, $$value => $$invalidate(4, $currentSearch = $$value));
    	validate_store(modalState, 'modalState');
    	component_subscribe($$self, modalState, $$value => $$invalidate(0, $modalState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let savedStateStores = ["state", "modalState", "currentSearch"];
    	let localStorageSyncUnsubscribe;

    	onMount(async () => {
    		await syncLocalStorageToState(savedStateStores);
    		localStorageSyncUnsubscribe = await syncStateToLocalStorage(savedStateStores);
    		getUserFeeds();
    		getUserCollections();
    	});

    	onDestroy(localStorageSyncUnsubscribe);

    	function handleKeypress(keyName) {
    		switch (keyName) {
    			case "Escape":
    				set_store_value(modalState, $modalState = { "modalType": null, "modalContent": null }, $modalState);
    				break;
    			case "Enter":
    				if ($modalState.modalType == "search") {
    					search($currentSearch);
    				}
    				break;
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const keydown_handler = e => handleKeypress(e.key);

    	$$self.$capture_state = () => ({
    		SideBar: Main$3,
    		MainWindow: Main_window,
    		ArticleModal: Article,
    		SearchModal: Main$1,
    		AuthModal: Main,
    		GetNameModal: GetName,
    		onMount,
    		onDestroy,
    		appConfig,
    		feeds,
    		articles,
    		modalState,
    		currentSearch,
    		search,
    		getUserFeeds,
    		getUserCollections,
    		syncLocalStorageToState,
    		syncStateToLocalStorage,
    		savedStateStores,
    		localStorageSyncUnsubscribe,
    		handleKeypress,
    		$currentSearch,
    		$modalState
    	});

    	$$self.$inject_state = $$props => {
    		if ('savedStateStores' in $$props) savedStateStores = $$props.savedStateStores;
    		if ('localStorageSyncUnsubscribe' in $$props) localStorageSyncUnsubscribe = $$props.localStorageSyncUnsubscribe;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$modalState, handleKeypress, keydown_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
