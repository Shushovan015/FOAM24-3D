# import base64
# from flask import Flask, request, jsonify
# import cv2
# import numpy as np
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)


# @app.route('/detect_contours', methods=['POST'])
# def detect_contours():
#     try:
#         # Get the image file from the request
#         image_file = request.files['image']
#         img_fs = image_file.read()  # FS to readable form
#         np_ary = np.frombuffer(img_fs, np.uint8)  # binary to ary form
#         image = cv2.imdecode(np_ary, cv2.IMREAD_COLOR)  # to color readable form
#         bnw = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
#         gus_blr = cv2.GaussianBlur(bnw, (5, 5), 0)
#         _, roi = cv2.threshold(gus_blr, 0, 255, cv2.THRESH_BINARY)  # image thresholding for segmenting
#         contour_img, _ = cv2.findContours(roi, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
#         if contour_img:
#             all_contour_points = [contour.reshape(-1, 2).tolist() for contour in contour_img]
#             contour_dict = {i + 1: sublist for i, sublist in enumerate(all_contour_points)}

#             cv2.drawContours(image, contour_img, -1, (0, 255, 0), 2)  # drawing the outline
            

#             _, buffer = cv2.imencode('.png', image)  # parsing to base64 file
#             image_data = base64.b64encode(buffer).decode('utf-8')  # img data

#             return jsonify({"image_data": image_data, "contours": all_contour_points})
#             # return jsonify({"image_data": image_data, "contours": contour_dict})


#         else:
#             return jsonify({"error": "No contours found."})

#     except Exception as e:
#         return jsonify({"error": str(e)})


# if __name__ == '__main__':
#     app.run(debug=True)


import base64
from flask import Flask, request, jsonify
import cv2
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5174", "https://fm24api.com"]}})


@app.route('/detect_contours', methods=['POST'])
def detect_contours():
    try:
        image_file = request.files['image']
        img_fs = image_file.read()
        np_ary = np.frombuffer(img_fs, np.uint8)
        image = cv2.imdecode(np_ary, cv2.IMREAD_COLOR)
        if image is None:
            return jsonify({"error": "Invalid image"}), 400

        bnw = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        gus_blr = cv2.GaussianBlur(bnw, (5, 5), 0)
        _, roi = cv2.threshold(gus_blr, 0, 255, cv2.THRESH_BINARY)

        contours, _ = cv2.findContours(roi, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

        raw_contours = []
        for contour in contours:
            if contour is None or len(contour) < 3:
                continue
            raw_contours.append(contour.reshape(-1, 2).tolist())

        if not raw_contours:
            return jsonify({"error": "No contours found."}), 200

        return jsonify({
            "contours": raw_contours,          # keep compatibility
            "contours_raw": raw_contours,      # explicit raw
            "image_width": int(image.shape[1]),
            "image_height": int(image.shape[0]),
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#      app.run(host='0.0.0.0', port=5000, debug=True)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)

