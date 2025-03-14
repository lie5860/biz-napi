use napi::{
    bindgen_prelude::*,
    threadsafe_function::{ErrorStrategy, ThreadsafeFunction, ThreadsafeFunctionCallMode},
    Result,
};
use rdev::{listen};
use std::{
    thread::spawn,
};

#[napi(ts_args_type = "callback: (event: string) => void")]
pub fn on_input_event(callback: JsFunction) -> Result<()> {
    let jsfn: ThreadsafeFunction<String, ErrorStrategy::Fatal> =
        callback.create_threadsafe_function(0, |ctx| Ok(vec![ctx.value]))?;
    // 从rdev获取监听事件传给 js
    spawn(|| {
        if let Err(error) = listen(move |event| {
            jsfn.call(
                serde_json::to_string(&event).unwrap(),
                ThreadsafeFunctionCallMode::NonBlocking,
            );
        }) {
            println!("Error: {:?}", error)
        }
    });
    Ok(())
}
