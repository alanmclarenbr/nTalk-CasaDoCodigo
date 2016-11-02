var app = require('../../app');
var should = require('should');
var request = require('supertest')(app);

describe('No controller contatos', function () {

    describe('O usuário não logado', function () {
        describe('Deve voltar para /', function () {
            it('Ao fazer GET /contatos', function (done) {
                request.get('/contatos').end(function (err, res) {
                    res.headers.location.should.eql('/');
                    done();
                });
            });

            it('Ao fazer GET /contato/1', function (done) {
               request.get('/contato/1').end(function (err, res) {
                   res.headers.location.should.eql('/');
                   done();
               });
            });

            it('Ao fazer GET /contato/1/editar', function (done) {
               request.get('/contato/1/editar').end(function (err, res) {
                  res.headers.location.should.eql('/');
                  done();
               });
            });

            it('Ao fazer POST /contato', function (done) {
               request.post('/contato').end(function (err, res) {
                   res.headers.location.should.eql('/');
                   done();
               });
            });

            it('Ao fazer DELETE /contato/1', function (done){
               request.del('/contato/1').end(function (err, res) {
                  res.headers.location.should.eql('/');
                  done();
               });
            });

            it('Ao fazer PUT /contato/1', function (done) {
               request.put('/contato/1').end(function (err, res) {
                  res.headers.location.should.eql('/');
                  done();
               });
            });
        });
    });

    describe('O usuário logado', function () {

    });
});