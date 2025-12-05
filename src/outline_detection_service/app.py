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
        # Get the image file from the request
        image_file = request.files['image']
        img_fs = image_file.read()  # FS to readable form
        np_ary = np.frombuffer(img_fs, np.uint8)  # binary to ary form
        image = cv2.imdecode(np_ary, cv2.IMREAD_COLOR)  # to color readable form
        bnw = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        gus_blr = cv2.GaussianBlur(bnw, (5, 5), 0)
        _, roi = cv2.threshold(gus_blr, 0, 255, cv2.THRESH_BINARY)  # image thresholding for segmenting

        # Debug: Check roi dimensions and non-zero pixels
        print(f"ROI shape: {roi.shape}, Non-zero pixels: {np.count_nonzero(roi)}")

        # Use CHAIN_APPROX_NONE for full contour points
        contours, _ = cv2.findContours(roi, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

        # Debug: Check the number of contours found
        print(f"Number of contours found: {len(contours)}")

        if contours:
            # Simplify contours with fine-tuned epsilon
            epsilon_factor = 0.002  # Start with a very small value for high precision
            simplified_contours = []

            for contour in contours:
                # Calculate epsilon dynamically based on contour's arc length
                epsilon = epsilon_factor * cv2.arcLength(contour, True)
                approx = cv2.approxPolyDP(contour, epsilon, closed=True)
                if approx is not None and len(approx) > 0:
                    simplified_contours.append(approx.reshape(-1, 2).tolist())
                else:
                    # Debug: Log if approximation failed
                    print(f"Approximation returned empty for contour with {len(contour)} points")

            # Debug: Log the number of points in each simplified contour
            for i, sc in enumerate(simplified_contours):
                print(f"Simplified contour {i + 1} has {len(sc)} points")

            # Draw simplified contours
            simplified_image = image.copy()
            for sc in simplified_contours:
                cv2.drawContours(simplified_image, [np.array(sc, dtype=np.int32)], -1, (0, 255, 0), 2)

            # Encode the image as base64
            _, buffer = cv2.imencode('.png', simplified_image)  # Encode simplified image to base64
            image_data = base64.b64encode(buffer).decode('utf-8')  # Base64 encode

            return jsonify({"image_data": image_data, "contours": simplified_contours})

        else:
            return jsonify({"error": "No contours found."})

    except Exception as e:
        return jsonify({"error": str(e)})


# if __name__ == '__main__':
#      app.run(host='0.0.0.0', port=5000, debug=True)

if __name__ == '__main__':
    app.run()
