use napi::{
    bindgen_prelude::*,
    threadsafe_function::{ErrorStrategy, ThreadsafeFunction, ThreadsafeFunctionCallMode},
    Result,
};
use rdev::{listen, Event as RdevEvent, Button};
use serde::{Deserialize, Serialize};
use std::{thread::spawn};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SerializableButton {
    Left,
    Right,
    Middle,
    Unknown(u8),
}

impl From<Button> for SerializableButton {
    fn from(button: Button) -> Self {
        match button {
            Button::Left => SerializableButton::Left,
            Button::Right => SerializableButton::Right,
            Button::Middle => SerializableButton::Middle,
            Button::Unknown(val) => SerializableButton::Unknown(val),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SerializableEventType {
    KeyPress(String),
    KeyRelease(String),
    ButtonPress(SerializableButton),
    ButtonRelease(SerializableButton),
    MouseMove { x: f64, y: f64 },
    Wheel { delta_x: i64, delta_y: i64 },
}

impl From<rdev::EventType> for SerializableEventType {
    fn from(event_type: rdev::EventType) -> Self {
        match event_type {
            rdev::EventType::KeyPress(key) => SerializableEventType::KeyPress(format!("{:?}", key)),
            rdev::EventType::KeyRelease(key) => SerializableEventType::KeyRelease(format!("{:?}", key)),
            rdev::EventType::ButtonPress(button) => SerializableEventType::ButtonPress(button.into()),
            rdev::EventType::ButtonRelease(button) => SerializableEventType::ButtonRelease(button.into()),
            rdev::EventType::MouseMove { x, y } => SerializableEventType::MouseMove { x, y },
            rdev::EventType::Wheel { delta_x, delta_y } => SerializableEventType::Wheel { delta_x, delta_y },
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SerializableEvent {
    pub time: std::time::SystemTime,
    pub event_type: SerializableEventType,
    pub platform_code: u32,
    pub position_code: u32,
    pub usb_hid: u32,
}

impl From<RdevEvent> for SerializableEvent {
    fn from(event: RdevEvent) -> Self {
        SerializableEvent {
            time: event.time,
            event_type: event.event_type.into(),
            platform_code: event.platform_code,
            position_code: event.position_code,
            usb_hid: event.usb_hid,
        }
    }
}

#[napi(ts_args_type = "callback: (event: string) => void")]
pub fn on_input_event(callback: JsFunction) -> Result<()> {
    let jsfn: ThreadsafeFunction<String, ErrorStrategy::Fatal> =
        callback.create_threadsafe_function(0, |ctx| Ok(vec![ctx.value]))?;
    
    spawn(move || {
        if let Err(error) = listen(move |event| {
            if let Ok(event_str) = handle_event(event) {
                jsfn.call(event_str, ThreadsafeFunctionCallMode::NonBlocking);
            }
        }) {
            println!("Error: {:?}", error)
        }
    });
    Ok(())
}

fn handle_event(event: RdevEvent) -> Result<String> {
    serde_json::to_string(&SerializableEvent::from(event))
        .map_err(|e| Error::from_reason(e.to_string()))
}
