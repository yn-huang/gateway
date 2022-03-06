const basejoi = require('joi');
const sanitizeHtml = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
})

const joi = basejoi.extend(extension)

module.exports.postSchema = joi.object({
    title: joi.string().required().min(1).escapeHTML(),
    description: joi.string().required().min(1).escapeHTML(),
    deleteImages: joi.array()
});

module.exports.commentSchema = joi.object({
    comment: joi.string().required().min(1).escapeHTML(),
    replyTo: joi.string().escapeHTML()
})

